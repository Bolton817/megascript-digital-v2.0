/**
 * Stage 15 Grounded Mock Assistant Engine for Tony
 * Complies with TDD Sheets 079, 080, 081, 082, 083, 084, 085, 086:
 * - Strict ZERO EMOJI rule (TDD Sheet 080)
 * - Bilingual English & Kiswahili (TDD Sheet 084)
 * - Grounded on approved published CMS knowledge context (TDD Sheet 083)
 * - Intent-aware non-coercive qualification (TDD Sheet 085)
 * - Accurate Kenyan market pricing disclosures (KSh 35,000 - 125,000) (TDD Sheet 086)
 * - Transparent AI identity disclosure (TDD Sheet 082)
 */

import { TonyIntentState } from "./intent";

export interface MockResponseOptions {
  language?: string;
  route?: string;
  contextSnippets?: string[];
  intent?: TonyIntentState;
  promptVersion?: string;
  leadReferenceCode?: string;
  isDeclineOrSkip?: boolean;
}

export interface MockResponseResult {
  content: string;
  model: string;
  latencyMs: number;
  tokensUsed: number;
  isHandoffRequested: boolean;
  intent: TonyIntentState;
  leadCaptured: boolean;
}

// Regex to catch unicode emoji ranges (TDD Sheet 080 strict zero emoji enforcement)
export const EMOJI_REGEX = new RegExp(
  "[\\u{1F600}-\\u{1F64F}\\u{1F300}-\\u{1F5FF}\\u{1F680}-\\u{1F6FF}\\u{1F1E0}-\\u{1F1FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F900}-\\u{1F9FF}\\u{1FA70}-\\u{1FAFF}]",
  "gu"
);

export function stripEmojis(text: string): string {
  return text.replace(EMOJI_REGEX, "").trim();
}

export function generateGroundedTonyReply(
  userMessage: string,
  options: MockResponseOptions = {}
): MockResponseResult {
  const query = userMessage.toLowerCase().trim();
  const {
    language = "en",
    route = "/",
    contextSnippets = [],
    intent = "INFORMATIONAL",
    promptVersion = "1.0.0",
    leadReferenceCode,
    isDeclineOrSkip = false,
  } = options;

  const isSwahili =
    language.toLowerCase() === "sw" ||
    /^(habari|hujambo|mambo|shikamoo|je,|bei|ofisi|wapi|msaada|nataka|nukuu|asante)/i.test(query);

  let reply = "";
  let isHandoffRequested = intent === "HANDOFF_REQUESTED";
  let leadCaptured = Boolean(leadReferenceCode);

  // 1. Lead captured confirmation (Visitor just submitted email/phone)
  if (leadReferenceCode) {
    if (isSwahili) {
      reply = `Asante sana! Timu yetu ya wahandisi imepokea mawasiliano yako kwa mafanikio (Rejeleo la Mradi: ${leadReferenceCode}). Tutapitia maelezo yako na kuwasiliana nawe ndani ya saa 2 za kazi za ofisi.`;
    } else {
      reply = `Thank you! Our engineering team has safely received your contact information (Project Ref: ${leadReferenceCode}). We typically review project specifications and respond within 2 business hours.`;
    }
  }

  // 2. Visitor politely declined lead capture ("skip", "not now", "no thanks")
  else if (isDeclineOrSkip) {
    if (isSwahili) {
      reply = "Nimekuelewa, hakuna shida hata kidogo. Unaweza kuendelea kuuliza maswali yoyote kuhusu uwezo wetu wa kiufundi, teknolojia tunazotumia, au mifumo yetu.";
    } else {
      reply = "Understood, not a problem at all. Feel free to ask any other questions about our engineering capabilities, development stack, or timeline.";
    }
  }

  // 3. Human Handoff Requested (Sheet 087)
  else if (intent === "HANDOFF_REQUESTED" || /human|person|agent|talk to someone|live chat|mwanadamu|ongea na mtu/i.test(query)) {
    isHandoffRequested = true;
    if (isSwahili) {
      reply = "Ninaweza kukuunganisha moja kwa moja na mtaalamu kutoka timu yetu. Unaweza kupiga simu au kututumia ujumbe kupitia WhatsApp kwa +254 712 345 678, au kutuma barua pepe kwa contact@megascriptdigital.co.ke. Ofisi yetu iko Bihi Towers, Ghorofa ya 5, Suite 04, Moi Avenue, Nairobi.";
    } else {
      reply = "I can connect you directly with a technical specialist from our team. You can call or WhatsApp us at +254 712 345 678, email contact@megascriptdigital.co.ke, or submit an inquiry at our Contact page (/contact). Our headquarters is located at Bihi Towers, 5th Floor, Suite 04, Moi Avenue, Nairobi.";
    }
  }

  // 4. High Intent: Quote, Proposal, Project Initiation (Sheet 085)
  else if (intent === "HIGH_INTENT") {
    if (isSwahili) {
      reply = "Tungependa sana kufanya kazi nawe kwenye mradi huu. Kwa tovuti za kawaida za biashara, bei yetu ya mwongozo ni KSh 35,000 hadi KSh 125,000 kulingana na muundo na kurasa. Mifumo maalum ya wavuti na programu za simu hupimwa kando baada ya kikao cha uchunguzi wa kiufundi.\n\nJe, ungependa timu yetu ya wahandisi iandae muhtasari rasmi wa makadirio ya mradi wako? Kama ndio, tafadhali shiriki barua pepe au nambari yako ya simu. (Unaweza kuandika 'hapana' kuendelea bila kushiriki).";
    } else {
      reply = "We would be glad to help engineer your solution. For standard corporate websites, our indicative pricing ranges between KSh 35,000 and KSh 125,000 depending on scope. Custom web applications and mobile apps are individually scoped following a technical discovery phase.\n\nWould you like our engineering team to follow up with a formal discovery brief or quote? If yes, what is your preferred email or phone number? (You may also type 'skip' to continue chatting).";
    }
  }

  // 5. Considering: Pricing & Timeline Inquiries (Sheet 086)
  else if (intent === "CONSIDERING" || /price|pricing|cost|how much|rates|budget|timeline|gharama|bei/i.test(query)) {
    if (isSwahili) {
      reply = "Mwongozo wetu wa bei za tovuti za kawaida za biashara ni kuanzia KSh 35,000 hadi KSh 125,000 kulingana na idadi ya kurasa na vipengele. Hii ni bei ya makadirio, si nukuu ya mwisho; nukuu rasmi hutolewa baada ya kuelewa mahitaji kamili. Mifumo maalum ya wavuti na programu za simu hupimwa kando baada ya uchunguzi wa kiufundi. Miradi ya kawaida ya tovuti huchukua takriban wiki 2 hadi 6.";
    } else {
      reply = "Our indicative pricing guide for standard corporate websites ranges between KSh 35,000 and KSh 125,000, depending on page count, custom UI requirements, and integrations. Please note this is an indicative guide, not a final quotation. For custom web applications and mobile applications, pricing is scoped after a technical discovery phase. Typical website delivery requires 2 to 6 weeks.";
    }
  }

  // 6. Grounded Products (Fortress, LeaseFlow, UzaDigital, FM Scheduler)
  else if (/fortress|leaseflow|uzadigital|fm scheduler/i.test(query)) {
    const productMention = query.match(/fortress|leaseflow|uzadigital|fm scheduler/i)?.[0];
    if (isSwahili) {
      reply = `Kuhusu bidhaa yetu ya ${productMention}: MegaScript Digital ina bidhaa za programu ikiwemo Fortress (AI website builder), LeaseFlow (rental management), UzaDigital (point-of-sale), na FM Scheduler (usimamizi wa ratiba za mitandao ya kijamii). Tovuti za bidhaa hizi ziko kando. Ikiwa ungependa maelezo zaidi au kuanza kuitumia, tunaweza kukuunganisha na timu ya bidhaa husika.`;
    } else {
      reply = `Regarding our software products: MegaScript Digital develops specialized platforms including Fortress (an AI website builder), LeaseFlow (rental property management system), UzaDigital (point-of-sale platform), and FM Scheduler (content scheduling workflow). Dedicated product websites operate separately; we can connect you directly with our product team for demos and access.`;
    }
  }

  // 7. Services & Capabilities Grounding
  else if (/service|what do you do|build|offer|develop|website|mobile app|software|huduma|mnafanya nini/i.test(query)) {
    if (isSwahili) {
      reply = "MegaScript Digital inatoa huduma kuu tatu: Utengenezaji wa tovuti na SEO, utengenezaji wa mifumo ya wavuti (web applications), na utengenezaji wa programu za simu za mkononi (iOS na Android). Pia tunatoa huduma za muundo wa picha, uhariri wa video, na mifumo ya kidijitali.";
    } else {
      reply = "MegaScript Digital builds high-performance corporate websites, bespoke web applications, mobile applications (iOS and Android), and automated operational systems. We focus on rigorous engineering, fast load speeds, accessible typography, and long-term maintainability.";
    }
  }

  // 8. Office Location & Hours
  else if (/location|where are you|office|address|directions|visit|bihi|wapi|ofisi/i.test(query)) {
    if (isSwahili) {
      reply = "Ofisi yetu iko katika Jumba la Bihi Towers, Ghorofa ya 5, Suite 04, Barabara ya Moi Avenue, Nairobi, Kenya. Tunafungua kuanzia Jumatatu hadi Ijumaa, saa 2:00 asubuhi hadi saa 11:00 jioni (EAT).";
    } else {
      reply = "Our physical office is located at Bihi Towers, 5th Floor, Suite 04, Moi Avenue, Nairobi, Kenya. We are open Monday through Friday from 8:00 AM to 5:00 PM EAT. You are welcome to schedule an in-person discovery meeting.";
    }
  }

  // 9. Informational Fallback
  else {
    if (isSwahili) {
      reply = "Hujambo! Mimi ni Tony, msaidizi rasmi wa kidijitali wa MegaScript Digital. Ninaweza kukusaidia kuelewa huduma zetu za kutengeneza tovuti, mifumo ya wavuti, programu za simu, makadirio ya bei (KSh 35,000 - 125,000), au kukuunganisha na wahandisi wetu.";
    } else {
      reply = "Hello! I am Tony, the official AI assistant for MegaScript Digital. I can assist you with information about our custom website development, bespoke web apps, mobile apps, indicative pricing (KSh 35,000 - 125,000), or connecting directly with our engineering team.";
    }
  }

  // Apply strict zero emoji invariant
  const cleanReply = stripEmojis(reply);

  return {
    content: cleanReply,
    model: promptVersion === "1.0.0" ? "mock-v1" : `mock-grounded-${promptVersion}`,
    latencyMs: Math.floor(Math.random() * 20) + 10,
    tokensUsed: Math.ceil(cleanReply.length / 4) + 30,
    isHandoffRequested,
    intent,
    leadCaptured,
  };
}

/**
 * Backward compatibility alias for Stage 14 tests and legacy callers.
 */
export function generateMockTonyReply(
  userMessage: string,
  language: string = "en"
): MockResponseResult {
  return generateGroundedTonyReply(userMessage, { language, promptVersion: "1.0.0" });
}
