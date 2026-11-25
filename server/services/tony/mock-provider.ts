/**
 * Stage 14 Deterministic Mock Assistant Engine for Tony
 * Complies with TDD Sheet 079 & 080:
 * - Strict ZERO EMOJI rule
 * - Plain English & Kiswahili
 * - Transparent AI identity disclosure
 * - Accurate Kenyan market pricing disclosures (KSh 35,000 - 125,000+)
 * - Physical office address (Bihi Towers, Moi Avenue, Nairobi)
 */

export interface MockResponseResult {
  content: string;
  model: string;
  latencyMs: number;
  tokensUsed: number;
  isHandoffRequested: boolean;
}

// Regex to catch standard unicode emoji ranges (TDD Sheet 080 strict zero emoji enforcement)
export const EMOJI_REGEX = new RegExp(
  "[\\u{1F600}-\\u{1F64F}\\u{1F300}-\\u{1F5FF}\\u{1F680}-\\u{1F6FF}\\u{1F1E0}-\\u{1F1FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F900}-\\u{1F9FF}\\u{1FA70}-\\u{1FAFF}]",
  "gu"
);

export function stripEmojis(text: string): string {
  return text.replace(EMOJI_REGEX, "").trim();
}

export function generateMockTonyReply(
  userMessage: string,
  language: string = "en"
): MockResponseResult {
  const query = userMessage.toLowerCase().trim();
  const isSwahili = language.toLowerCase() === "sw" || /^(habari|hujambo|mambo|shikamoo|je,|bei|ofisi|wapi|msaada)/i.test(query);

  let reply = "";
  let isHandoffRequested = false;

  // 1. Human Handoff / Live Agent Requests
  if (
    /human|person|agent|talk to someone|call me|whatsapp|speak with|live chat|quote|consultation/i.test(query) ||
    /mtu|ongea|zungumza|mwanadamu|piga simu/i.test(query)
  ) {
    isHandoffRequested = true;
    if (isSwahili) {
      reply =
        "Ninaweza kukuunganisha moja kwa moja na mtaalamu wa kiufundi kutoka timu yetu. Unaweza kupiga simu au kututumia ujumbe kupitia WhatsApp kwa +254 712 345 678, au ujaze fomu ya mawasiliano kwenye ukurasa wetu wa Contact. Mshauri wetu atajibu ndani ya saa 2 za kazi.";
    } else {
      reply =
        "I can connect you directly with a technical specialist from our team. You can call or WhatsApp us directly at +254 712 345 678, email contact@megascriptdigital.co.ke, or submit an enquiry through our Contact page. Our team responds within 2 business hours.";
    }
  }

  // 2. Pricing & Cost Queries
  else if (
    /price|pricing|cost|how much|rate|quote|fee|expensive|cheap|ksh|kes|budget/i.test(query) ||
    /bei|gharama|pesa|kiasi gani|ngapi/i.test(query)
  ) {
    if (isSwahili) {
      reply =
        "Bei zetu za tovuti za kawaida za biashara huanzia KSh 35,000 hadi KSh 65,000 kulingana na ukubwa na vipengele. Mifumo maalum ya wavuti (web applications) na programu za simu huanzia KSh 65,000 hadi KSh 125,000+. Mifumo mikubwa ya kiwango cha mashirika hupangwa kulingana na mahitaji maalum ya mradi.";
    } else {
      reply =
        "Our standard corporate websites typically range between KSh 35,000 and KSh 65,000 depending on scope and functionality. Custom web applications, client portals, and mobile apps range from KSh 65,000 to KSh 125,000+. Enterprise systems and specialized integrations are scoped individually based on architectural requirements.";
    }
  }

  // 3. Services & Capabilities
  else if (
    /service|what do you do|build|offer|develop|website|mobile app|software|capabilities|stack/i.test(query) ||
    /huduma|mnafanya nini|tovuti|programu|mfumo/i.test(query)
  ) {
    if (isSwahili) {
      reply =
        "MegaScript Digital inajishughulisha na utengenezaji wa tovuti za kisasa, mifumo ya wavuti inayofanya kazi kiotomatiki, programu za simu za mkononi (iOS na Android), na mifumo ya biashara ya kidijitali. Tunazingatia usalama wa hali ya juu, wepesi wa utendaji, na muundo safi.";
    } else {
      reply =
        "MegaScript Digital builds high-performance corporate websites, bespoke web applications, mobile applications (iOS and Android), and automated operational systems. We focus on rigorous engineering, fast load speeds, accessible typography, and long-term maintainability.";
    }
  }

  // 4. Physical Location & Office Hours
  else if (
    /location|where are you|office|address|directions|visit|hours|bihi/i.test(query) ||
    /wapi|ofisi|mahali|anwani|muda|saa/i.test(query)
  ) {
    if (isSwahili) {
      reply =
        "Ofisi yetu iko katika Jumba la Bihi Towers, Ghorofa ya 5, Suite 04, Barabara ya Moi Avenue, Nairobi, Kenya. Tunafungua kuanzia Jumatatu hadi Ijumaa, saa 2:00 asubuhi hadi saa 11:00 jioni (EAT).";
    } else {
      reply =
        "Our physical office is located at Bihi Towers, 5th Floor, Suite 04, Moi Avenue, Nairobi, Kenya. Our offices are open Monday through Friday from 8:00 AM to 5:00 PM EAT. You are welcome to schedule an in-person meeting or consultation.";
    }
  }

  // 5. Contact Details
  else if (
    /contact|email|phone|call|telephone|reach|talk|touch/i.test(query) ||
    /wasiliana|nambari|simu|barua pepe/i.test(query)
  ) {
    if (isSwahili) {
      reply =
        "Unaweza kuwasiliana na timu yetu kwa kupiga simu au WhatsApp kwa +254 712 345 678, au kutuma barua pepe kwa contact@megascriptdigital.co.ke. Fomu yetu ya mawasiliano pia inapatikana kwenye tovuti.";
    } else {
      reply =
        "You can reach our team directly at +254 712 345 678 (voice and WhatsApp), or via email at contact@megascriptdigital.co.ke. You can also send a direct enquiry through the Contact page on this website.";
    }
  }

  // 6. Greetings & Welcomes
  else if (
    /^(hi|hello|hey|good morning|good afternoon|good evening|greetings|howdy|sup)/i.test(query) ||
    /^(habari|hujambo|mambo|shikamoo|jambo|sasa)/i.test(query)
  ) {
    if (isSwahili) {
      reply =
        "Hujambo! Mimi ni Tony, msaidizi wa kidijitali wa MegaScript Digital. Ninawezaje kukusaidia leo kuhusu tovuti, mifumo ya wavuti, au makadirio ya bei?";
    } else {
      reply =
        "Hello! I am Tony, the digital assistant for MegaScript Digital. How can I help you today with websites, custom web applications, or our pricing?";
    }
  }

  // 7. Identity & Bot Explanation
  else if (
    /who are you|what are you|are you human|are you an ai|bot|robot/i.test(query) ||
    /wewe ni nani|wewe ni roboti|wewe ni mtu/i.test(query)
  ) {
    if (isSwahili) {
      reply =
        "Mimi ni Tony, msaidizi wa kidijitali anayejiendesha kiotomatiki wa MegaScript Digital. Niko hapa kukusaidia kupata taarifa za huduma zetu, makadirio ya bei, na kukuunganisha na wahandisi wetu.";
    } else {
      reply =
        "I am Tony, an automated digital assistant for MegaScript Digital. I help prospective clients and visitors explore our technical capabilities, pricing ranges, and connect with our engineering team.";
    }
  }

  // 8. Default Fallback
  else {
    if (isSwahili) {
      reply =
        "Asante kwa swali lako. Kama msaidizi wa Hatua ya 14, naweza kukueleza kuhusu huduma zetu za tovuti na mifumo, makadirio ya bei (KSh 35,000 - 125,000+), au ofisi yetu jijini Nairobi. Ikiwa unahitaji jibu maalum, unaweza kutumia nambari yetu +254 712 345 678 au barua pepe contact@megascriptdigital.co.ke.";
    } else {
      reply =
        "Thank you for your message. As the Stage 14 assistant, I can provide immediate details on our development services, indicative pricing (KSh 35,000 - 125,000+), and office location. If you have a specific requirement, I can also connect you with our technical team via +254 712 345 678 or contact@megascriptdigital.co.ke.";
    }
  }

  // Enforce zero emoji guarantee
  const sanitizedReply = stripEmojis(reply);

  // Compute realistic mock metadata
  const wordCount = sanitizedReply.split(/\s+/).length;
  const estimatedTokens = Math.ceil(wordCount * 1.35) + 12;
  const simulatedLatencyMs = Math.floor(Math.random() * 120) + 140; // 140ms - 260ms

  return {
    content: sanitizedReply,
    model: "mock-v1",
    latencyMs: simulatedLatencyMs,
    tokensUsed: estimatedTokens,
    isHandoffRequested,
  };
}
