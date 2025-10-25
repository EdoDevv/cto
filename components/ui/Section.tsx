import styles from './Section.module.css';

interface SectionProps {
  title: string;
  description: string;
  index: number;
}

export default function Section({ title, description, index }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <span className={styles.index}>0{index}</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
}
