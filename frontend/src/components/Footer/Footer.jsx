// Footer.jsx
import { FaFacebook, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="white/70 text-gray-800 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo & Description */}
        <div>
          <h2 className="text-xl font-bold #0a192f mb-2">Bookcove</h2>
          <p>
            Bookcove is a Book Store Website. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
          <div className="flex gap-4 mt-4 #0a192f text-lg">
            <FaFacebook />
            <FaYoutube />
            <FaTwitter />
            <FaInstagram />
          </div>
        </div>

        {/* Book Categories */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Book Categories</h3>
          <ul className="space-y-2">
            <li>Action</li>
            <li>Adventure</li>
            <li>Romance</li>
            <li>Drama</li>
            <li>Horror</li>
            <li className="#0a192f cursor-pointer">View more →</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>About us</li>
            <li>Contact us</li>
            <li>Products</li>
            <li>Sign Up</li>
            <li>FAQ</li>
            <li>Shipment</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Our Store</h3>
          <ul className="space-y-2">
            <li> 3rd Floor, DLF Emporio Mall Nelson Mandela Road</li>
            <li> +123 345123 556</li>
            <li> support@bookcove.com</li>
            <li> New Delhi – 110070 India</li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 border-t pt-6 text-center text-xs text-gray-500">
        <p>© 2024 Bookcove Book Store Website. All Rights Reserved.</p>
        <p className="mt-1">Made with Love by Avantika</p>
      </div>
    </footer>
  );
}
