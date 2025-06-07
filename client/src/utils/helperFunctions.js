export const getInitials = (name = "John Doe") => {
    const words = name.trim().split(" ");
    if (words.length === 0) return "";
    const first = words[0].charAt(0);
    const last = words[words.length - 1].charAt(0);
    return (first + last).toUpperCase();
};