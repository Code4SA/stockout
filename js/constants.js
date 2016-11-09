// Set up constant values
window.constants = window.constants || {};

constants.URL = 'https://cbm.code4sa.org/stockouts/stats/';
constants.PRV_IMAGES = {
  EC: 'ec.png',
  FS: 'fs.png',
  GT: 'gau.png',
  KZN: 'kzn.png',
  LIM: 'lim.png',
  MP: 'mpu.png',
  NC: 'nc.png',
  NW: 'nw.png',
  WC: 'wc.png'
};
constants.MONTHS = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
constants.MEDICINES = {
  "aba": "Abacavir (ABC) is currently recommended as part of first- and second-line antiretroviral therapy (ART) for HIV-positive paediatric patients.",
  "adr": "Adrenaline is used as a treatment for anaphylaxis. Anaphylaxis is an extreme form of an allergic reaction can cause swelling of your mouth and tongue, breathing problems, flushing, collapse and a loss of consciousness.",
  "amosus": "Amoxicillin suspension is used susceptible infections including ear/nose/throat, genetial and unirary tract, skin and skin structures, lower respiratory, acute uncomplicated gonorrhea.",
  "amocap": "Amoxicillin capsules are used susceptible infections including ear/nose/throat, genetial and unirary tract, skin and skin structures, lower respiratory, acute uncomplicated gonorrhea.",
  "azi": "Azithromycin is used to treat many different types of infections caused by bacteria, such as respiratory infections, skin infections, ear infections, and sexually transmitted diseases.",
  "cef": "Azithromycin is used to treat many different types of infections caused by bacteria, such as respiratory infections, skin infections, ear infections, and sexually transmitted diseases.", // Double of azi; legacy
  "bec": "Beclomethasone 50 mcg or 100 mcg inhaler indicated as primary maintenance treatment in patients with persistent symptoms of chronic bronchial asthma.",
  "cex": "Ceftriaxone injection is used to treat certain infections caused by bacteria such as gonorrhea (a sexually transmitted disease), pelvic inflammatory disease (infection of the female reproductive organs that may cause infertility), meningitis (infection of the membranes that surround the brain and spinal cord), and infections of the lungs, ears, skin, urinary tract, blood, bones, joints, and abdomen.",
  "dta": "DTaP-IPV-Hib vaccine protects your child against diphtheria, tetanus, pertussis, polio, and Haemophilus influenzae type b, which are serious and sometimes fatal diseases. When you get your child immunized, you help protect others as well.",
  "hyd": " Hydrochlorothiazide treats fluid retention (edema) in people with congestive heart failure, cirrhosis of the liver, or kidney disorders, or edema caused by taking steroids or estrogen. This medication is also used to treat high blood pressure (hypertension).",
  "ins": "Insulin injection is used to control blood sugar in people who have type 1 diabetes (condition in which the body does not make insulin and therefore cannot control the amount of sugar in the blood) or in people who have type 2 diabetes.",
  "iso": "Isoniazid is used with other medications to treat active tuberculosis (TB) infections. It is also used alone to prevent active TB infections in people who may be infected with the bacteria (people with positive TB skin test). Isoniazid is an antibiotic and works by stopping the growth of bacteria.",
  "lam": "Lamivudine 10 mg/mL solution (240 mL)",
  "med": "Medroxyprogesterone is a progestogen, which is a female hormone. It is used to prevent pregnancy. It is a very effective and safe form of contraception.",
  "met": " Metformin is used in patients with type 2 diabetes. Controlling high blood sugar helps prevent kidney damage, blindness, nerve problems, loss of limbs, and sexual function problems.",
  "partab": "Paracetamol is a pain reliever and a fever reducer. The exact mechanism of action of is not known.",
  "parsyr": "Paracetamol is a pain reliever and a fever reducer. The exact mechanism of action of is not known.",
  "rif150": "FDC regimen for treatment of tuberculosis.",
  "rif60": "FDC regimen for treatment of tuberculosis.",
  "sod": "Sodium Chloride used to flush wounds and skin abrasions, as eye drops, for intravenous infusion, rinsing contact lenses, nasal irrigation, and a variety of other purposes.",
  "ten": "Antiretroviral drugs (ARVs) will be used in the first line treatment of HIV-positive patients.",
  "tet": "Tetanus toxoid vaccine is given to provide protection (immunity) against tetanus (lockjaw) in adults and children 7 years or older.",
  "val": "Sodium valproate is used to prevent epileptic seizures in children.",
  "car": "Sodium valproate is used to prevent epileptic seizures in children.", // Double of VAL; legacy
  "hex": "DTaP-IPV-Hib vaccine protects your child against diphtheria, tetanus, pertussis, polio, and Haemophilus influenzae type b, which are serious and sometimes fatal diseases. When you get your child immunized, you help protect others as well." // Double of DTA; legacy
};
