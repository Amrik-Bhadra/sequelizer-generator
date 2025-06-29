export const fieldTypeOptions = [
    { value: "STRING", label: "String" },
    { value: "INTEGER", label: "Integer" },
    { value: "DECIMAL", label: "Decimal" },
    { value: "FLOAT", label: "Float" },
    { value: "BOOLEAN", label: "Boolean" },
    { value: "DATE", label: "Date" },
    { value: "ARRAY", label: "Array" },
    { value: "JSON", label: "JSON Object" },
]

export const arrayTypeOptions = [
    { value: "STRING", label: "String" },
    { value: "INTEGER", label: "Integer" },
    { value: "FLOAT", label: "Float" },
    { value: "DECIMAL", label: "Decimal" },
    { value: "BOOLEAN", label: "Boolean" },
    { value: "DATE", label: "Date" },
]

export const yesNoOptions = [
    { value: "No", label: "No" },
    { value: "Yes", label: "Yes" },
]

export const validationOptions = [
    { value: "", label: "Select validation" },
    { value: "none", label: "None" },
    { value: "len", label: "Length (min, max)" },
    { value: "is", label: "Regex Pattern" },
    { value: "isEmail", label: "Email" },
    { value: "isNumeric", label: "Numeric" },
    // { value: "customValidator", label: "Custom Function" },
]