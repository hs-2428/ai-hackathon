/**
 * Master test runner - runs all local tests
 */

const { runAllTests: testLambdas } = require('./test-lambdas');
const { runAllTests: testMobileServices } = require('./test-mobile-services');

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TRIBAL APP - LOCAL TESTING SUITE');
  console.log('='.repeat(60));
  
  const results = [];
  
  // Test Lambda functions
  console.log('\n📦 PHASE 1: Backend Lambda Functions');
  console.log('-'.repeat(60));
  try {
    const lambdaSuccess = await testLambdas();
    results.push({ phase: 'Lambda Functions', success: lambdaSuccess });
  } catch (error) {
    console.error('❌ Lambda tests failed:', error.message);
    results.push({ phase: 'Lambda Functions', success: false });
  }
  
  // Test Mobile services
  console.log('\n📱 PHASE 2: Mobile App Services');
  console.log('-'.repeat(60));
  try {
    const mobileSuccess = await testMobileServices();
    results.push({ phase: 'Mobile Services', success: mobileSuccess });
  } catch (error) {
    console.error('❌ Mobile tests failed:', error.message);
    results.push({ phase: 'Mobile Services', success: false });
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('🎯 FINAL TEST SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? 'PASSED' : 'FAILED';
    console.log(`${icon} ${result.phase}: ${status}`);
  });
  
  const allPassed = results.every(r => r.success);
  
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Ready to deploy to AWS.');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Please fix issues before deploying.');
  }
  console.log('='.repeat(60) + '\n');
  
  return allPassed;
}

if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };
