import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import '../styles/theme.module.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
