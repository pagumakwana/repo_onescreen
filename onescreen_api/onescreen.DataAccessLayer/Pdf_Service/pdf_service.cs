using System;
using PuppeteerSharp;
using PuppeteerSharp.Media;

namespace onescreen.DataAccessLayer.Pdf_Service
{
	public class pdf_service : IAsyncDisposable
    {
        private IBrowser? _browser;
        private bool _initialized;
        private readonly SemaphoreSlim _browserLock = new(1, 1);

        private readonly int _maxConcurrentPages;
        private readonly int _recycleAfter; // number of PDFs before restarting Chrome
        private int _pdfCountSinceStart = 0;
        private readonly SemaphoreSlim _pageSemaphore;

        /// <summary>
        /// High-volume PDF generator constructor
        /// </summary>
        /// <param name="maxConcurrentPages">How many pages to generate in parallel</param>
        /// <param name="recycleAfter">Restart browser after this many PDFs to prevent memory leaks</param>
        public pdf_service(int maxConcurrentPages = 5, int recycleAfter = 500)
        {
            _maxConcurrentPages = maxConcurrentPages;
            _recycleAfter = recycleAfter;
            _pageSemaphore = new SemaphoreSlim(_maxConcurrentPages);
        }


        /// <summary>
        /// Initialize Chrome browser (only once)
        /// </summary>
        public async Task InitializeAsync()
        {
            if (_initialized) return;

            await _browserLock.WaitAsync();
            try
            {
                if (_initialized) return;

                _browser = await Puppeteer.LaunchAsync(new LaunchOptions
                {
                    Headless = true,
                    ExecutablePath = GetChromePath(),
                    Args = new[]
                    {
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu"
                }
                });

                _initialized = true;
                _pdfCountSinceStart = 0;
            }
            finally
            {
                _browserLock.Release();
            }
        }


        /// <summary>
        /// Generate a single PDF safely
        /// </summary>
        public async Task<string> GeneratePdfFileAsync(string htmlContent, string outputFolder, string fileName)
        {
            // Ensure browser is alive
            if (_browser == null || !_browser.IsConnected)
            {
                _initialized = false;
                await InitializeAsync();
            }

            // Handle browser recycling
            _pdfCountSinceStart++;
            if (_pdfCountSinceStart > _recycleAfter)
            {
                await RecycleBrowserAsync();
            }

            // Limit concurrent pages
            await _pageSemaphore.WaitAsync();
            try
            {
                // Ensure output folder exists
                if (!Directory.Exists(outputFolder))
                    Directory.CreateDirectory(outputFolder);

                var fullPath = Path.Combine(outputFolder, fileName);

                // Remove existing file if any
                if (File.Exists(fullPath))
                    File.Delete(fullPath);

                // Create new page for this PDF
                await using var page = await _browser.NewPageAsync();

                await page.SetContentAsync(htmlContent, new NavigationOptions
                {
                    WaitUntil = new[] { WaitUntilNavigation.Networkidle0 }
                });

                await page.PdfAsync(fullPath, new PdfOptions
                {
                    Format = PaperFormat.A4,
                    PrintBackground = true
                });

                return fullPath;
            }
            finally
            {
                _pageSemaphore.Release();
            }
        }


        /// <summary>
        /// Recycle Chrome browser to prevent memory leaks
        /// </summary>
        private async Task RecycleBrowserAsync()
        {
            await _browserLock.WaitAsync();
            try
            {
                if (_browser != null)
                {
                    await _browser.CloseAsync();
                    _browser.Dispose();
                }

                _initialized = false;
                await InitializeAsync();
            }
            finally
            {
                _browserLock.Release();
            }
        }


        static string GetChromePath()
        {
            string[] paths =
            {
           // Windows paths
        @"C:\Program Files\Google\Chrome\Application\chrome.exe",
        @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",

        // macOS Chrome
        @"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        @"/Applications/Chromium.app/Contents/MacOS/Chromium",

        // macOS Edge
        @"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
        };

            foreach (var path in paths)
            {
                if (File.Exists(path)) return path;
            }

            throw new FileNotFoundException("Chrome/Edge not found. Please install Chrome or Edge.");
        }

        /// <summary>
        /// Dispose browser at application shutdown
        /// </summary>
        public async ValueTask DisposeAsync()
        {
            if (_browser != null)
            {
                await _browser.CloseAsync();
                _browser.Dispose();
            }
        }

    }
}

