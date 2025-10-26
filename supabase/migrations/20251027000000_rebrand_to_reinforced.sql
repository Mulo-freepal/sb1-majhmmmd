/*
  # Rebrand from PAZZLE to REINFORCED
  
  Updates all FAQ entries to replace "PAZZLE" with "REINFORCED - Workforce you trust"
*/

-- Update FAQ questions and answers to replace PAZZLE with REINFORCED
UPDATE faqs 
SET question = REPLACE(question, 'PAZZLE', 'REINFORCED'),
    answer = REPLACE(answer, 'PAZZLE', 'REINFORCED'),
    updated_at = now()
WHERE question LIKE '%PAZZLE%' OR answer LIKE '%PAZZLE%';

-- Update schema comment
COMMENT ON TABLE employers IS 'REINFORCED - Workforce you trust: Employer accounts and profiles';
COMMENT ON TABLE workers IS 'REINFORCED - Workforce you trust: Worker profiles and information';
