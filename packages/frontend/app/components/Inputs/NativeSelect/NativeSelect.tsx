interface NativeSelectProps {
    value: any;
    options: any[];
    fieldName: string;
    onChange: (value: any) => void;
}

const NativeSelect: React.FC<NativeSelectProps> = ({
    options,
    fieldName,
    onChange,
}) => {
    return (
        <>
            {
                <select onChange={(e) => onChange(e.target.value)}>
                    {options.map((option) => (
                        <option
                            key={option[fieldName]}
                            value={option[fieldName]}
                        >
                            {option[fieldName]}
                        </option>
                    ))}
                </select>
            }
        </>
    );
};

export default NativeSelect;
