import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBranding() {
  console.log('🔄 Starting rebranding process...\n');

  try {
    // Fetch all FAQs that contain "PAZZLE"
    const { data: faqs, error: fetchError } = await supabase
      .from('faqs')
      .select('*')
      .or('question.ilike.%PAZZLE%,answer.ilike.%PAZZLE%');

    if (fetchError) {
      throw new Error(`Failed to fetch FAQs: ${fetchError.message}`);
    }

    if (!faqs || faqs.length === 0) {
      console.log('✅ No FAQs found with "PAZZLE" - database is already updated!');
      return;
    }

    console.log(`📝 Found ${faqs.length} FAQ(s) to update:\n`);

    // Update each FAQ
    let successCount = 0;
    let errorCount = 0;

    for (const faq of faqs) {
      const updatedQuestion = faq.question.replace(/PAZZLE/gi, 'REINFORCED');
      const updatedAnswer = faq.answer.replace(/PAZZLE/gi, 'REINFORCED');

      console.log(`Updating FAQ: "${faq.question.substring(0, 50)}..."`);

      const { error: updateError } = await supabase
        .from('faqs')
        .update({
          question: updatedQuestion,
          answer: updatedAnswer,
          updated_at: new Date().toISOString(),
        })
        .eq('id', faq.id);

      if (updateError) {
        console.error(`  ❌ Error: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ Updated successfully`);
        successCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`\n✨ Rebranding complete!`);
    console.log(`   ✅ Successfully updated: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed to update: ${errorCount}`);
    }
    console.log('\n🎉 All "PAZZLE" references have been changed to "REINFORCED"');
    console.log('   Refresh your browser to see the changes!\n');

  } catch (error) {
    console.error('\n❌ Error during rebranding:', error);
    process.exit(1);
  }
}

// Run the script
updateBranding();
