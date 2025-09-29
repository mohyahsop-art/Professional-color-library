import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Copy, Check, Search, Palette } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { copyToClipboard as copyText } from "../utils/clipboard";

// Comprehensive collection of organized colors
export const COLOR_CATEGORIES = {
  "Reds": [
    { name: "Red", hex: "#FF0000", rgb: "255, 0, 0" },
    { name: "Dark Red", hex: "#8B0000", rgb: "139, 0, 0" },
    { name: "Light Pink", hex: "#FFB6C1", rgb: "255, 182, 193" },
    { name: "Crimson", hex: "#DC143C", rgb: "220, 20, 60" },
    { name: "Fire Brick", hex: "#B22222", rgb: "178, 34, 34" },
    { name: "Tomato", hex: "#FF6347", rgb: "255, 99, 71" },
    { name: "Coral", hex: "#FF7F50", rgb: "255, 127, 80" },
    { name: "Indian Red", hex: "#CD5C5C", rgb: "205, 92, 92" },
  ],
  "Blues": [
    { name: "Blue", hex: "#0000FF", rgb: "0, 0, 255" },
    { name: "Sky Blue", hex: "#87CEEB", rgb: "135, 206, 235" },
    { name: "Navy", hex: "#000080", rgb: "0, 0, 128" },
    { name: "Royal Blue", hex: "#4169E1", rgb: "65, 105, 225" },
    { name: "Turquoise", hex: "#40E0D0", rgb: "64, 224, 208" },
    { name: "Deep Sky Blue", hex: "#006994", rgb: "0, 105, 148" },
    { name: "Powder Blue", hex: "#B0E0E6", rgb: "176, 224, 230" },
    { name: "Steel Blue", hex: "#4682B4", rgb: "70, 130, 180" },
  ],
  "Greens": [
    { name: "Green", hex: "#008000", rgb: "0, 128, 0" },
    { name: "Light Green", hex: "#90EE90", rgb: "144, 238, 144" },
    { name: "Dark Green", hex: "#006400", rgb: "0, 100, 0" },
    { name: "Olive", hex: "#808000", rgb: "128, 128, 0" },
    { name: "Lime Green", hex: "#32CD32", rgb: "50, 205, 50" },
    { name: "Forest Green", hex: "#228B22", rgb: "34, 139, 34" },
    { name: "Sea Green", hex: "#2E8B57", rgb: "46, 139, 87" },
    { name: "Mint Green", hex: "#98FB98", rgb: "152, 251, 152" },
  ],
  "Yellows": [
    { name: "Yellow", hex: "#FFFF00", rgb: "255, 255, 0" },
    { name: "Gold", hex: "#FFD700", rgb: "255, 215, 0" },
    { name: "Light Yellow", hex: "#FFFFE0", rgb: "255, 255, 224" },
    { name: "Lemon Chiffon", hex: "#FFFACD", rgb: "255, 250, 205" },
    { name: "Dark Orange", hex: "#FF8C00", rgb: "255, 140, 0" },
    { name: "Cornsilk", hex: "#FFF8DC", rgb: "255, 248, 220" },
    { name: "Banana Yellow", hex: "#FFEF96", rgb: "255, 239, 150" },
    { name: "Canary Yellow", hex: "#FFFF99", rgb: "255, 255, 153" },
  ],
  "Oranges": [
    { name: "Orange", hex: "#FFA500", rgb: "255, 165, 0" },
    { name: "Dark Orange", hex: "#FF8C00", rgb: "255, 140, 0" },
    { name: "Orange Red", hex: "#FF4500", rgb: "255, 69, 0" },
    { name: "Peach Puff", hex: "#FFE4B5", rgb: "255, 228, 181" },
    { name: "Peach", hex: "#FFCBA4", rgb: "255, 203, 164" },
    { name: "Peru", hex: "#B87333", rgb: "184, 115, 51" },
    { name: "Coral", hex: "#FF7F50", rgb: "255, 127, 80" },
    { name: "Pumpkin", hex: "#FF7518", rgb: "255, 117, 24" },
  ],
  "Purples": [
    { name: "Purple", hex: "#800080", rgb: "128, 0, 128" },
    { name: "Plum", hex: "#DDA0DD", rgb: "221, 160, 221" },
    { name: "Indigo", hex: "#4B0082", rgb: "75, 0, 130" },
    { name: "Dark Violet", hex: "#4B0082", rgb: "75, 0, 130" },
    { name: "Dark Magenta", hex: "#8B008B", rgb: "139, 0, 139" },
    { name: "Orchid", hex: "#DA70D6", rgb: "218, 112, 214" },
    { name: "Violet", hex: "#DDA0DD", rgb: "221, 160, 221" },
    { name: "Lavender", hex: "#E6E6FA", rgb: "230, 230, 250" },
  ],
  "Pinks": [
    { name: "Pink", hex: "#FFC0CB", rgb: "255, 192, 203" },
    { name: "Deep Pink", hex: "#FF1493", rgb: "255, 20, 147" },
    { name: "Light Pink", hex: "#FFB6C1", rgb: "255, 182, 193" },
    { name: "Fuchsia", hex: "#FF00FF", rgb: "255, 0, 255" },
    { name: "Hot Pink", hex: "#FF69B4", rgb: "255, 105, 180" },
    { name: "Light Coral", hex: "#F08080", rgb: "240, 128, 128" },
    { name: "Medium Violet Red", hex: "#C71585", rgb: "199, 21, 133" },
    { name: "Bright Pink", hex: "#FF1493", rgb: "255, 20, 147" },
  ],
  "Grays": [
    { name: "Gray", hex: "#808080", rgb: "128, 128, 128" },
    { name: "Light Gray", hex: "#D3D3D3", rgb: "211, 211, 211" },
    { name: "Dark Gray", hex: "#A9A9A9", rgb: "169, 169, 169" },
    { name: "Silver", hex: "#C0C0C0", rgb: "192, 192, 192" },
    { name: "Dim Gray", hex: "#696969", rgb: "105, 105, 105" },
    { name: "Dark Slate Gray", hex: "#2F4F4F", rgb: "47, 79, 79" },
    { name: "White Smoke", hex: "#F5F5F5", rgb: "245, 245, 245" },
    { name: "Charcoal", hex: "#36454F", rgb: "54, 69, 79" },
  ],
  "Browns": [
    { name: "Brown", hex: "#A52A2A", rgb: "165, 42, 42" },
    { name: "Tan", hex: "#D2B48C", rgb: "210, 180, 140" },
    { name: "Dark Brown", hex: "#654321", rgb: "101, 67, 33" },
    { name: "Chocolate", hex: "#D2691E", rgb: "210, 105, 30" },
    { name: "Saddle Brown", hex: "#8B4513", rgb: "139, 69, 19" },
    { name: "Beige", hex: "#F5F5DC", rgb: "245, 245, 220" },
    { name: "Sandy Brown", hex: "#F4A460", rgb: "244, 164, 96" },
    { name: "Coffee", hex: "#6F4E37", rgb: "111, 78, 55" },
  ],
};

// Common basic colors
export const BASIC_COLORS = [
  { name: "White", hex: "#FFFFFF", rgb: "255, 255, 255" },
  { name: "Black", hex: "#000000", rgb: "0, 0, 0" },
  { name: "Red", hex: "#FF0000", rgb: "255, 0, 0" },
  { name: "Green", hex: "#00FF00", rgb: "0, 255, 0" },
  { name: "Blue", hex: "#0000FF", rgb: "0, 0, 255" },
  { name: "Yellow", hex: "#FFFF00", rgb: "255, 255, 0" },
  { name: "Cyan", hex: "#00FFFF", rgb: "0, 255, 255" },
  { name: "Magenta", hex: "#FF00FF", rgb: "255, 0, 255" },
];

interface ColorLibraryProps {
  onColorSelect?: (color: any) => void;
}

export function ColorLibrary({ onColorSelect }: ColorLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = async (text: string, colorName: string) => {
    const success = await copyText(text);
    if (success) {
      setCopiedColor(text);
      toast.success(`Copied ${colorName}: ${text}`);
      setTimeout(() => setCopiedColor(null), 2000);
    } else {
      toast.error("Failed to copy");
    }
  };

  const filterColors = (colors: any[]) => {
    if (!searchTerm) return colors;
    return colors.filter(color => 
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.hex.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getAllColors = () => {
    let allColors = [...BASIC_COLORS];
    Object.values(COLOR_CATEGORIES).forEach(categoryColors => {
      allColors = [...allColors, ...categoryColors];
    });
    return allColors;
  };

  const displayColors = selectedCategory 
    ? filterColors(COLOR_CATEGORIES[selectedCategory] || [])
    : filterColors(getAllColors());

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for a color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Colors
            </Button>
            {Object.keys(COLOR_CATEGORIES).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategory 
              ? `${selectedCategory} Colors (${displayColors.length})`
              : `All Colors (${displayColors.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayColors.map((color, index) => (
              <div
                key={`${color.hex}-${index}`}
                className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Color Sample */}
                <div
                  className="h-24 w-full cursor-pointer transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex, color.name)}
                  title={`Click to copy: ${color.hex}`}
                />
                
                {/* Color Information */}
                <div className="p-3">
                  <h4 className="text-sm mb-2">{color.name}</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">HEX</span>
                      <code className="text-xs font-mono">{color.hex}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">RGB</span>
                      <code className="text-xs font-mono">{color.rgb}</code>
                    </div>
                  </div>
                  
                  {/* Copy Buttons */}
                  <div className="flex gap-1 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7"
                      onClick={() => copyToClipboard(color.hex, color.name)}
                    >
                      {copiedColor === color.hex ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7"
                      onClick={() => copyToClipboard(`rgb(${color.rgb})`, color.name)}
                    >
                      RGB
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {displayColors.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3>No colors found</h3>
              <p className="text-muted-foreground">
                Try searching with a different term or select another category
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}