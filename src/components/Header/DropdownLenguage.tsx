import DropdownDefault from "../Dropdowns/DropdownDefault"
export const DropdownLenguage = () => {
    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Español" },
      ];
    return (
        <DropdownDefault
        languages={languages}
        />
    )
}