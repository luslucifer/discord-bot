
import puppeteer,{Page} from 'puppeteer'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const home = 'https://creators.joinmavely.com/home'

export class P{
    private password : string|any
    private email : string|any
    
    constructor(){
        this.password = process.env.PASSWORD
        this.email = process.env.EMAIL

    }

    async  p(link:string){
        const cookiesFilePath = 'cookies.json';
        const browser = await puppeteer.launch({headless:true})
        const page:Page = await browser.newPage()
        
        try {
            const previousSession = fs.existsSync(cookiesFilePath);
            if (previousSession){
                const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, 'utf-8'));
                await page.setCookie(...cookies)
            }
            else{
                // console.log('fuck')
                await this.login(previousSession,page)
            }
            await page.goto(home,{waitUntil:'networkidle0'})

            const urlCompact = await page.$('input[placeholder="Enter URL to create a link"]');
        if (urlCompact) {
            await urlCompact.type(link);
        } else {
            throw new Error('URL input field not found');
        }

        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) {
            await submitBtn.click();
        } else {
            throw new Error('Submit button not found');
        }
 
        // Wait for the result and extract the final link
        await page.waitForFunction(() =>  /https:\/\/mavely.app.link\/e\/[^]+/.test(document.body.innerText), { timeout: 100000 });
        const p = await page.evaluate(() => {
            const pElements = document.querySelectorAll('p');
            // console.log(pElements.length)
            return Array.from(pElements).map(e => e.innerText);
        });
        // console.log(' p tags length is ====')
        // console.log(p.length)
        // console.log(p)
        const finalLink = p.find(l => /https:\/\/mavely.app.link\/e\/[^]+/.test(l)) || '';
        console.log('final link  here ')
        console.log(finalLink)

        return finalLink; 


            
        } catch (error) { 
         console.error(error)   
        }
        finally{
            browser.close()
        }
        
    }
    
    
    async  login(previousSession: boolean, page: Page,) {

        try {
            
            if (!previousSession) {
                const email = await page.$('#email');
                if (email) {
                    await email.type(this.email);
                } else {
                    throw new Error('Email input not found');
                }
                
                const password = await page.$('#password');
                if (password) {
                    await password.type(this.password);
                } else {
                    throw new Error('Password input not found');
                }
        
                const signInButton = await page.$('button[type="submit"]');
                if (signInButton) {
                    await signInButton.click();
                    await page.waitForNavigation({ waitUntil: 'networkidle2' }); // Wait for navigation to ensure login is complete
                } else {
                    throw new Error('Sign in button not found');
                }
                
                // Save cookies after login
                const cookies = await page.cookies();
                fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
            }
        } catch (error) {
            
        }
    }
    
}
    
// const link = 'https://www.walmart.com/'
// const p = new P().p(link)
