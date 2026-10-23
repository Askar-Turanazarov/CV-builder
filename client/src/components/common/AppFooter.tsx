import styles from './AppFooter.module.css';

export default function AppFooter() {
  return (
    <footer className={`${styles.footer} app-footer no-print`}>
      <div className="container">CV Forge — by Askar © 2026</div>
    </footer>
  );
}
