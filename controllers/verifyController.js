
const Indicator = require("../models/Indicator");
const Report = require("../models/Report");

const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"')]+/gi;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const PHONE_RE = /\+?\d[\d\s().-]{8,}\d/g;

const onlyDigits = (p) => p.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");

const hostOf = (u) => {
    try {
        const full = /^https?:\/\//i.test(u) ? u : "http://" + u;
        return new URL(full).hostname.toLowerCase().replace(/^www\./, "");
    } catch (error) {
        return null;
    }
};

// Pull links, emails and phone numbers out of the pasted text
const extract = (content) => {
    const urls = (content.match(URL_RE) || []).map((u) => u.replace(/[.,;]+$/, ""));
    const emails = (content.match(EMAIL_RE) || []).map((e) => e.toLowerCase());
    const phones = (content.match(PHONE_RE) || []).map(onlyDigits);
    const urlHosts = urls.map(hostOf).filter(Boolean);
    const hosts = [...urlHosts, ...emails.map((e) => e.split("@")[1])];

    return { urls, emails, phones, urlHosts, hosts };
};

const matches = (indicator, content, found) => {
    const v = indicator.value.toLowerCase();

    switch (indicator.kind) {
        case "keyword":
            return content.toLowerCase().includes(v);
        case "domain":
            return found.hosts.some((h) => h === v || h.endsWith("." + v));
        case "email":
            return found.emails.includes(v);
        case "phone":
            return found.phones.includes(onlyDigits(v));
        default:
            return false;
    }
};

// +5 if a link, phone or email appears in the evidence of a verified report.
// Evidence is stored as text in the Report model, so we search that text.
const inVerifiedReport = async (found) => {
    const reports = await Report.find({ status: "verified" }).select("evidence");

    const evidence = reports
        .map((r) => (typeof r.evidence === "string" ? r.evidence : JSON.stringify(r.evidence || "")))
        .join("\n")
        .toLowerCase();

    if (!evidence) return false;

    const evidenceDigits = evidence.replace(/\D/g, "");

    return (
        found.urlHosts.some((h) => evidence.includes(h)) ||
        found.emails.some((e) => evidence.includes(e)) ||
        found.phones.some((p) => p.length >= 10 && evidenceDigits.includes(p))
    );
};

// 0-2 low, 3-5 medium, 6 or more high
const riskLevel = (score) => (score >= 6 ? "high" : score >= 3 ? "medium" : "low");

// POST /api/verify   body: { text, link }
const verify = async (req, res) => {
    try {
        const { text, link } = req.body || {};

        if ((text && typeof text !== "string") || (link && typeof link !== "string")) {
            return res.status(400).json({ error: "text and link must be strings" });
        }

        const content = [text, link].filter(Boolean).join(" ").trim();

        if (!content) {
            return res.status(400).json({ error: "Send a text or a link to check" });
        }

        const found = extract(content);
        const indicators = await Indicator.find();
        const hits = indicators.filter((i) => matches(i, content, found));

        let score = hits.reduce((sum, i) => sum + i.weight, 0);

        const reasons = hits.map((i) => ({
            kind: i.kind,
            value: i.value,
            weight: i.weight,
            explanation: i.explanation
        }));

        if (await inVerifiedReport(found)) {
            score += 5;
            reasons.push({
                kind: "report",
                value: "verified report",
                weight: 5,
                explanation: "This link, phone number or email appears in a verified scam report."
            });
        }

        res.json({ risk: riskLevel(score), score, reasons });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { verify, riskLevel };
