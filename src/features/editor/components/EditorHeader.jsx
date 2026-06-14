import { ArrowLeft } from "lucide-react";
import Button from "../../../components/Button";

export default function EditorHeader({ onNavigate, pdfInstance, onDownload }) {
  return (
    <header className="bg-base-100 border-b border-base-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
      <Button
        onClick={() => onNavigate("dashboard")}
        variant="outline"
        size="sm"
        icon={<ArrowLeft size={16} />}
      >
        Dashboard
      </Button>
      <span className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        CRÉATEUR DE CV SMART AFRICA 🛠
      </span>
      <button
        type="button"
        onClick={onDownload}
        disabled={pdfInstance.loading}
        className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
      >
        {pdfInstance.loading ? "Génération..." : "Télécharger le CV"}
      </button>
    </header>
  );
}
