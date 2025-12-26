import { memo, useMemo } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Heart
} from "lucide-react";

// PNG fallback import
import logoPng from "../assets/logo/logo.webp";

/* ================= STATIC DATA ================= */
const quickLinks = ["Home", "Menu", "About", "Contact", "Login"];

const socialIcons = [
  { Icon: Instagram, link: "#" },
  { Icon: Facebook, link: "#" },
  { Icon: Twitter, link: "#" }
];

const Footer = memo(function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-orange-50 text-gray-700 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-2 lg:grid-cols-4">

        {/* 🍽️ Brand */}
        <div>
          {/* ✅ WebP + PNG fallback */}
          <picture>
            <source
              srcSet={new URL("../assets/logo/logo.webp", import.meta.url)}
              type="image/webp"
            />
            <img
              src={logoPng}
              alt="Apna Kitchen Logo"
              loading="lazy"
              decoding="async"
              className="h-40 w-auto object-contain mb-4"
            />
          </picture>

          <p className="text-sm leading-relaxed text-gray-600">
            Serving hot, fresh & authentic Indian food with love.
            From our kitchen to your home — every bite feels like home. ❤️
          </p>
        </div>

        {/* 📜 Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            {quickLinks.map(item => (
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
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Contact
          </h3>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
              <span>
                Purulia Road, Near AG Church, Kanta Toli, Ranchi – 834001,
                Jharkhand, India
              </span>
            </li>

            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-orange-500" />
              <a href="tel:+918709935537">+91 87099 35537</a>
            </li>

            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-orange-500" />
              <a href="tel:+917352310303">+91 73523 10303</a>
            </li>

            <li className="flex gap-3">
              <Mail className="w-5 h-5 text-orange-500" />
              <a href="mailto:apkakitchen.ranchi@gmail.com">
                apkakitchen.ranchi@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* 🌐 Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Follow Us
          </h3>
          <p className="text-sm text-gray-600 mb-5">
            For offers & delicious updates.
          </p>

          <div className="flex gap-4">
            {socialIcons.map(({ Icon, link }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Social media link"
                className="
                  w-11 h-11 rounded-full
                  bg-white shadow
                  flex items-center justify-center
                  text-orange-500
                  hover:bg-orange-500 hover:text-white
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
        © {year} Apka Kitchen. All rights reserved.
        <span className="block mt-1">
          Website made with{" "}
          <Heart className="inline w-4 h-4 text-orange-500 fill-orange-500" />{" "}
          TrionexIndia
        </span>
      </div>
    </footer>
  );
});

export default Footer;
