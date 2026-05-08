const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTests() {
    // 1. Setup the invisible robot (Headless Chrome)
    let options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    let passed = 0; 
    let failed = 0;

    // Helper function to run a test and count it
    async function test(name, testLogic) {
        try {
            await testLogic();
            console.log(`✅ Passed: ${name}`);
            passed++;
        } catch (error) {
            console.log(`❌ Failed: ${name}`);
            failed++;
        }
    }

    console.log("🚀 Starting the 15 Automated Tests...\n");

    try {
        // URLs mapped to the Docker container names defined in your docker-compose
        const customerUrl = 'http://grocery-customer:3000/customerlogin.html';
        const adminUrl = 'http://grocery-admin:3001/adminlogin.html';

        // --- CUSTOMER TESTS ---
        await driver.get(customerUrl);
        
        await test("Test 1: Customer login page loads", async () => { 
            await driver.getTitle(); 
        });

        await test("Test 2: Customer password field exists", async () => { 
            // Specifically targeting the login form to avoid confusion with the signup form
            await driver.findElement(By.css('#login-form input[name="password"]')); 
        });

        await test("Test 3: Customer login button exists", async () => { 
            await driver.findElement(By.css('#login-form button.submit-btn')); 
        });

        await test("Test 4: Customer logo is displayed", async () => { 
            await driver.findElement(By.className('logo')); 
        });

        await test("Test 5: Customer main container exists", async () => { 
            await driver.findElement(By.className('main-container')); 
        });

        // --- ADMIN TESTS ---
        await driver.get(adminUrl);
        
        await test("Test 6: Admin login page loads", async () => { 
            let title = await driver.getTitle(); 
            if(!title.includes('Grocify')) throw new Error("Wrong title"); 
        });
        
        await test("Test 7: Admin ID input field exists", async () => { 
            await driver.findElement(By.name('id')); 
        });
        
        await test("Test 8: Admin Password input field exists", async () => { 
            await driver.findElement(By.name('password')); 
        });
        
        await test("Test 9: Admin form uses POST method", async () => { 
            let form = await driver.findElement(By.id('login-form'));
            let method = await form.getAttribute('method');
            if(method.toUpperCase() !== 'POST') throw new Error("Not POST");
        });

        await test("Test 10: Admin form action points to /admin/login", async () => { 
            let form = await driver.findElement(By.id('login-form'));
            let action = await form.getAttribute('action');
            if(!action.includes('/admin/login')) throw new Error("Wrong action");
        });

        await test("Test 11: Admin ID field is marked 'required'", async () => { 
            let idField = await driver.findElement(By.name('id'));
            let isReq = await idField.getAttribute('required');
            if(isReq === null) throw new Error("Not required");
        });

        await test("Test 12: Admin Password field is marked 'required'", async () => { 
            let passField = await driver.findElement(By.name('password'));
            let isReq = await passField.getAttribute('required');
            if(isReq === null) throw new Error("Not required");
        });

        await test("Test 13: Admin Submit button exists", async () => { 
            await driver.findElement(By.className('submit-btn')); 
        });

        await test("Test 14: Auth container box exists", async () => { 
            await driver.findElement(By.className('auth-container')); 
        });

        await test("Test 15: Admin ID field only accepts numbers", async () => { 
            let idField = await driver.findElement(By.name('id'));
            let type = await idField.getAttribute('type');
            if(type !== 'number') throw new Error("Not a number field");
        });

    } finally {
        console.log(`\n📊 Final Score: ${passed}/15 Passed.`);
        await driver.quit();
        // If even one test fails, we exit with 1 so Jenkins marks the build as FAILED
        if (failed > 0) process.exit(1); 
    }
}

runTests();
