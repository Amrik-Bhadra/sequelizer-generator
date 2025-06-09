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