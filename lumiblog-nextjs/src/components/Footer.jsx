export default function Footer() {
  return (
    <footer className="w-[95%] max-w-[95vw] mx-auto bg-brand-lightPink pt-16 pb-8 border border-rose-100 rounded-3xl relative overflow-hidden mb-4">
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-50 -z-0 pointer-events-none"></div>

      <div className="px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 w-full">
          <div className="lg:col-span-1 w-full">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 block">
              Lumi<span className="text-brand-pink">Blog</span>
            </span>
            <p className="text-brand-gray text-sm mb-6 max-w-xs">
              Inspiring stories about life, travel, wellness and everything in between.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-dark hover:bg-brand-pink hover:text-white transition shadow-sm"
              >
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-dark hover:bg-brand-pink hover:text-white transition shadow-sm"
              >
                <i className="fa-brands fa-twitter text-sm"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-dark hover:bg-brand-pink hover:text-white transition shadow-sm"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-dark hover:bg-brand-pink hover:text-white transition shadow-sm"
              >
                <i className="fa-brands fa-pinterest-p text-sm"></i>
              </a>
            </div>
          </div>

          <div className="w-full">
            <h4 className="font-bold text-brand-dark mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-brand-gray">
              <li><a href="#" className="hover:text-brand-pink transition">Home</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">Categories</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">About</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">Contact</a></li>
            </ul>
          </div>

          <div className="w-full">
            <h4 className="font-bold text-brand-dark mb-4">Helpful Links</h4>
            <ul className="space-y-2 text-sm text-brand-gray">
              <li><a href="#" className="hover:text-brand-pink transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">Terms of Use</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">Disclaimer</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">FAQ</a></li>
            </ul>
          </div>

          <div className="w-full">
            <h4 className="font-bold text-brand-dark mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-brand-gray">
              <li><a href="#" className="hover:text-brand-pink transition">Travel</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">Lifestyle</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">Wellness</a></li>
              <li><a href="#" className="hover:text-brand-pink transition">Personal Growth</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rose-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <p className="text-sm text-brand-gray text-center sm:text-left">
            © 2024 LumiBlog. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-brand-gray">
            <i className="fa-solid fa-mug-hot text-brand-pink"></i>
            <span className="text-xs">Made with love &amp; coffee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
