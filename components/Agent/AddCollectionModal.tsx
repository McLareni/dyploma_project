"use client";

import { useState } from "react";
import Modal from "../UI/Modal";

interface GeneratedWord {
  word: string;
  translation: string;
}

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function AddCollectionModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCollectionModalProps) {
  const [collectionName, setCollectionName] = useState("");

  const handleSubmit = () => {
    if (!collectionName.trim()) return;
    onSubmit(collectionName);
    setCollectionName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 p-6">
        <h2 className="text-xl font-bold text-gray-700">Add New Collection</h2>
        <input
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder="Enter collection name"
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Add Collection
          </button>
        </div>
      </div>
    </Modal>
  );
}
