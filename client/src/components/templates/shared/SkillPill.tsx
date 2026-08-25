import type { SkillEntry } from '../../../types/resume';
import styles from './SkillPill.module.css';

export default function SkillPill({ skill }: { skill: SkillEntry }) {
  return (
    <span className={`${styles.pill} skill-pill`}>
      {skill.name}
      {skill.level && (
        <span className={styles.dots} aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={i <= (skill.level ?? 0) ? styles.dotFilled : styles.dot} />
          ))}
        </span>
      )}
    </span>
  );
}
