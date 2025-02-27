import { useState } from "react";
import styles from './ComboBox.module.css';
import { FaChevronDown } from "react-icons/fa";

interface ComboBoxProps {
  value: any;
  options: any[];
  fieldName?: string;
  onChange: (value: any) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({ value, options, fieldName, onChange }) => {

  const [isOpen, setIsOpen] = useState(false);

  const optionOnClick = (option: any) => {
    onChange(fieldName ? option[fieldName] : option);
    setIsOpen(false);
  }

  return (
<>
<div className={styles.comboBoxContainer}>  
  <div className={styles.comboBoxValueContainer} onClick={() => setIsOpen(!isOpen)}>
<div className={styles.comboBoxValue} >{value} </div>
<FaChevronDown className={`${styles.comboBoxIcon} ${isOpen ? styles.comboBoxIconOpen : ''}`} />
</div>

{
  isOpen && (
    <div className={styles.comboBoxOptionsWrapper}>
      
      {
        options.map((option) => (
          <div key={fieldName ? option[fieldName] : option} className={fieldName ? (option[fieldName] === value ? styles.comboBoxOptionSelected : '') : (option === value ? styles.comboBoxOptionSelected : '')} onClick={() => optionOnClick(option)}>{fieldName ? option[fieldName] : option}</div>
        ))
      }
    </div>
  )
}
</div>
  </>

  );
}

export default ComboBox;
