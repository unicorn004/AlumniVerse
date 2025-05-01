// Custom Alert Modal Component
"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function AlertModal({ 
  isOpen, 
  onClose, 
  title = "Alert", 
  message, 
  type = "error" 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-w-md w-full bg-background rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className={`p-4 ${type === "error" ? "bg-red-100 border-l-4 border-red-500" : "bg-green-100 border-l-4 border-green-500"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {type === "error" ? (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-green-500 mr-2" />
              )}
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-6">
          <p className="whitespace-pre-line">{message}</p>
        </div>
        <div className="p-4 flex justify-end border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}