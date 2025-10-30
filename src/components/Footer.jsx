import { Github, Twitter, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="glass-effect border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-display font-bold gradient-text mb-4">
              PhotoPay
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              A decentralized marketplace for digital art powered by Solana. 
              Buy and sell unique photography with instant, secure payments.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Globe className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/explore">Explore</FooterLink>
              <FooterLink href="/create">Create</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API</FooterLink>
              <FooterLink href="#">Support</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>© 2025 PhotoPay. Built with 💜 on Solana.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.1, y: -2 }}
    className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
  >
    {icon}
  </motion.a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <motion.a
      href={href}
      whileHover={{ x: 5 }}
      className="hover:text-foreground transition-colors inline-block"
    >
      {children}
    </motion.a>
  </li>
);