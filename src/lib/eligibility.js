// =============================================================================
// eligibility.js — a small, transparent rule engine. Results are ALWAYS phrased
// as "You may be eligible" in the UI, never "You are eligible" (SAFETY.md §5).
// Final eligibility is decided by the government department; the UI says so.
//
// We deliberately keep these rules simple and readable — the *why* matters more
// than cleverness. When in doubt we return 'need_info' rather than a false
// "not eligible", so nobody is wrongly discouraged from applying.
//
// Input `a` is the wizard answers object. No Aadhaar or bank-account NUMBERS are
// ever collected — only yes/no facts (e.g. "do you have an Aadhaar card?").
// =============================================================================

const ELIGIBLE = 'eligible'
const NOT_ELIGIBLE = 'not_eligible'
const NEED_INFO = 'need_info'

function isBplLike(a) {
  return a.rationCard === 'BPL' || a.rationCard === 'Antyodaya'
}
function isScSt(a) {
  return a.category === 'SC' || a.category === 'ST'
}

// PMMVY — first living child, mother age >= 19, not a regular govt employee.
function pmmvy(a) {
  if (a.citizen === 'No')
    return { status: NOT_ELIGIBLE, reason: 'PMMVY is for Indian citizens.' }
  if (a.govtEmployee === 'Yes')
    return {
      status: NOT_ELIGIBLE,
      reason: 'Regular Central/State Government or PSU employees are not eligible.',
    }
  if (a.age && Number(a.age) < 19)
    return { status: NOT_ELIGIBLE, reason: 'Mother must be at least 19 years old.' }
  if (a.pregnancyNumber && a.pregnancyNumber !== 'First')
    return {
      status: NEED_INFO,
      reason:
        'The central benefit is for the first living child. Some states extend it to a second child (especially a girl child) — confirm locally.',
    }
  return { status: ELIGIBLE, reason: 'First child, age 19+, and not a government employee.' }
}

// JSY — BPL or SC/ST, with an institutional (hospital) delivery planned.
function jsy(a) {
  const qualifiesGroup = isBplLike(a) || isScSt(a)
  if (a.hospitalDelivery === 'No')
    return {
      status: NOT_ELIGIBLE,
      reason: 'JSY supports institutional (hospital) delivery.',
    }
  if (!qualifiesGroup)
    return {
      status: NEED_INFO,
      reason:
        'Cash benefit is prioritised for BPL and SC/ST mothers; some states cover all women. Confirm your state’s rule.',
    }
  if (a.hospitalDelivery === 'Not decided')
    return {
      status: NEED_INFO,
      reason: 'You qualify by category — decide on a hospital delivery to claim JSY.',
    }
  return {
    status: ELIGIBLE,
    reason: 'Priority group with an institutional delivery planned.',
  }
}

// PMJAY — based on SECC deprivation criteria. We can't verify SECC here, so treat
// as "need more info" unless the household is Antyodaya/BPL.
function pmjay(a) {
  if (isBplLike(a))
    return {
      status: ELIGIBLE,
      reason: 'Antyodaya/BPL households are commonly covered — verify your name on the portal.',
    }
  return {
    status: NEED_INFO,
    reason: 'Coverage is based on the SECC list. Check your family’s name on the PMJAY portal.',
  }
}

// POSHAN Abhiyaan — universal for pregnant & lactating women, no income test.
function poshan() {
  return {
    status: ELIGIBLE,
    reason: 'Available to all pregnant and lactating women through your Anganwadi.',
  }
}

// PM POSHAN / ICDS supplementary nutrition — universal for pregnant & lactating
// women through Anganwadi, no income test.
function pmposhan() {
  return {
    status: ELIGIBLE,
    reason: 'Supplementary nutrition is available to all pregnant and lactating women via ICDS/Anganwadi.',
  }
}

const RULES = {
  pmmvy,
  jsy,
  pmjay,
  poshan,
  pmposhan,
}

// Run all encoded rules. Returns [{ id, status, reason }]. Schemes without an
// encoded rule are omitted from the results (the wizard focuses on the five the
// spec asks us to encode).
export function evaluateEligibility(a) {
  return Object.entries(RULES).map(([id, fn]) => ({ id, ...fn(a) }))
}

export const STATUS = { ELIGIBLE, NOT_ELIGIBLE, NEED_INFO }
