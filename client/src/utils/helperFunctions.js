import toast from "react-hot-toast";

export const getInitials = (name = "John Doe") => {
    const words = name.trim().split(" ");
    if (words.length === 0) return "";
    const first = words[0].charAt(0);
    const last = words[words.length - 1].charAt(0);
    return (first + last).toUpperCase();
};


export const copyToClipboard = async (content) => {
    try {
        await navigator.clipboard.writeText(content);
        toast.success('Code copied to clipboard')
    } catch (err) {
        toast.error(err);
    }
};


export const downloadJsFile = (code, filename) => {
    try {
        const blob = new Blob([code], { type: "application/javascript" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);


    } catch (error) {
        console.log(error);
        toast.error('Failed to download file');
    }
};


export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatDateToDMY = (dateInput) => {
  const date = new Date(dateInput);

  const day = String(date.getDate()).padStart(2, '0');       
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();                           

  return `${day}/${month}/${year}`;
}
