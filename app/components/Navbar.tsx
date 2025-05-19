// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [openConvert, setOpenConvert] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>iloveITF</Link>

        <ul className={styles.links}>
          <li><Link href="/merge">Merge PDF</Link></li>
          <li><Link href="/split">Split PDF</Link></li>
          <li><Link href="/compress">Compress PDF</Link></li>
          <li
            className={styles.dropdown}
            onMouseEnter={() => setOpenConvert(true)}
            onMouseLeave={() => setOpenConvert(false)}
          >
            <span className={styles.dropToggle}>Convert PDF ▾</span>
            {openConvert && (
              <ul className={styles.menu}>
                <li><Link href="/convert/csv2pdf">CSV → PDF</Link></li>
                <li><Link href="/convert/csv2xlsx">CSV → Excel</Link></li>
                <li><Link href="/convert/pdf2csv">PDF → CSV</Link></li>
                <li><Link href="/convert/xlsx2csv">Excel → CSV</Link></li>
                <li className={styles.separator}/>
                <li><Link href="/analysis">Analysis</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
