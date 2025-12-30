import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Heart } from "lucide-react";
import logo from "../assets/logo/logo.webp";
export default function Footer() {
  return (
    <footer className="bg-orange-50 text-gray-700 pt-16 pb-10">

      <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-2 lg:grid-cols-4">

        {/* 🍽️ Brand */}
        <div>
          <div className="mb-4">
            <img
              src={logo}
              alt="Apna Kitchen Logo"
              className="h-40 w-auto object-contain"
            />
          </div>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Serving hot, fresh & authentic Indian food with love.
            From our kitchen to your home — every bite feels like home. ❤️
          </p>
        </div>


        {/* 📜 Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            {["Home", "Menu", "About", "Contact", "Login"].map((item) => (
              <li key={item}>
                <a
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="hover:text-orange-600 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 📞 Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact</h3>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
              <span>
                Purulia Road, Near AG Church, Kanta Toli, Ranchi – 834001, Jharkhand, India
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-orange-500" />
              <span>+91 87099 35537</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-orange-500" />
              <span>+91 73523 10303</span>
            </li>
            <li className="flex gap-3">
              <Mail className="w-5 h-5 text-orange-500" />
              <span>apkakitchen.ranchi@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* 🌐 Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Follow Us</h3>
          <p className="text-sm text-gray-600 mb-5">
            For offers & delicious updates.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="
                  w-11 h-11 rounded-full
                  bg-white shadow
                  flex items-center justify-center
                  text-orange-500 hover:bg-orange-500 hover:text-white
                  transition
                "
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ❤️ Bottom */}
      <div className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Apka Kitchen. All rights reserved.  
        <span className="block mt-1">
          Website made by <Heart className="inline w-4 h-4 text-orange-500 fill-orange-500" /> TrionexIndia
        </span>
      </div>
    </footer>
  );
}
