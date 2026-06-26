/**
 * GitHub Actions 脚本 - 使用 Puppeteer 绕过 JS Challenge 定时抓取 RSS
 * 配合 .github/workflows/grab-rss.yml 使用
 */

import puppeteer from 'puppeteer';

const GRAB_URL = process.env.GRAB_URL;

if (!GRAB_URL) {
  console.error('GRAB_URL 环境变量未设置');
  process.exit(1);
}

async function main() {
  console.log(`[${new Date().toISOString()}] 开始抓取 RSS...`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('访问:', GRAB_URL);
    await page.goto(GRAB_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    // 等待 JSON 响应出现
    await page.waitForFunction(
      () => document.body.innerText.includes('"success"'),
      { timeout: 30000 }
    );

    const result = await page.evaluate(() => document.body.innerText);
    console.log('抓取结果:', result);

    const data = JSON.parse(result);
    
    if (data.success) {
      console.log(`成功: 抓取 ${data.fetched} 条，新增 ${data.saved} 条`);
      if (data.errors?.length > 0) {
        console.log('警告:', data.errors.join('; '));
      }
    } else {
      console.error('失败:', data.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('执行失败:', error.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
  
  console.log(`[${new Date().toISOString()}] 完成`);
}

main();
