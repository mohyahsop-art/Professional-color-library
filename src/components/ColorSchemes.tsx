import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Copy, Check, Search, Palette, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { copyToClipboard as copyText } from "../utils/clipboard";

interface ColorScheme {
  name: string;
  colors: string[];
  description: string;
  category: string;
}

export const COLOR_SCHEMES: Record<string, ColorScheme[]> = {
  "Tailwind CSS": [
    {
      name: "Tailwind Slate",
      colors: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"],
      description: "Cool grays with a subtle blue tint",
      category: "Tailwind CSS"
    },
    {
      name: "Tailwind Gray",
      colors: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827"],
      description: "Pure neutral grays",
      category: "Tailwind CSS"
    },
    {
      name: "Tailwind Red",
      colors: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"],
      description: "Vibrant reds for errors and attention",
      category: "Tailwind CSS"
    },
    {
      name: "Tailwind Blue",
      colors: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"],
      description: "Clean blues for primary actions",
      category: "Tailwind CSS"
    },
    {
      name: "Tailwind Green",
      colors: ["#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"],
      description: "Fresh greens for success states",
      category: "Tailwind CSS"
    },
    {
      name: "Tailwind Purple",
      colors: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7c3aed", "#6d28d9", "#581c87"],
      description: "Rich purples for brand colors",
      category: "Tailwind CSS"
    }
  ],
  "Material Design": [
    {
      name: "Material Red",
      colors: ["#ffebee", "#ffcdd2", "#ef9a9a", "#e57373", "#ef5350", "#f44336", "#e53935", "#d32f2f", "#c62828", "#b71c1c"],
      description: "Google's Material Design red palette",
      category: "Material Design"
    },
    {
      name: "Material Pink",
      colors: ["#fce4ec", "#f8bbd9", "#f48fb1", "#f06292", "#ec407a", "#e91e63", "#d81b60", "#c2185b", "#ad1457", "#880e4f"],
      description: "Vibrant pink from Material Design",
      category: "Material Design"
    },
    {
      name: "Material Purple",
      colors: ["#f3e5f5", "#e1bee7", "#ce93d8", "#ba68c8", "#ab47bc", "#9c27b0", "#8e24aa", "#7b1fa2", "#6a1b9a", "#4a148c"],
      description: "Rich purple palette",
      category: "Material Design"
    },
    {
      name: "Material Deep Purple",
      colors: ["#ede7f6", "#d1c4e9", "#b39ddb", "#9575cd", "#7e57c2", "#673ab7", "#5e35b1", "#512da8", "#4527a0", "#311b92"],
      description: "Deep purple tones",
      category: "Material Design"
    },
    {
      name: "Material Indigo",
      colors: ["#e8eaf6", "#c5cae9", "#9fa8da", "#7986cb", "#5c6bc0", "#3f51b5", "#3949ab", "#303f9f", "#283593", "#1a237e"],
      description: "Indigo blues for modern interfaces",
      category: "Material Design"
    },
    {
      name: "Material Blue",
      colors: ["#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6", "#42a5f5", "#2196f3", "#1e88e5", "#1976d2", "#1565c0", "#0d47a1"],
      description: "Classic Material blue",
      category: "Material Design"
    }
  ],
  "Flat Design": [
    {
      name: "Flat UI Blues",
      colors: ["#ecf0f1", "#bdc3c7", "#3498db", "#2980b9", "#34495e", "#2c3e50"],
      description: "Clean flat design blues and grays",
      category: "Flat Design"
    },
    {
      name: "Flat UI Greens",
      colors: ["#d5dbdb", "#a2d5ab", "#2ecc71", "#27ae60", "#16a085", "#1abc9c"],
      description: "Natural flat design greens",
      category: "Flat Design"
    },
    {
      name: "Flat UI Reds",
      colors: ["#fadbd8", "#f1948a", "#e74c3c", "#c0392b", "#a93226", "#922b21"],
      description: "Bold flat design reds",
      category: "Flat Design"
    },
    {
      name: "Flat UI Oranges",
      colors: ["#fdeaa7", "#fdcb6e", "#e17055", "#d63031", "#a29bfe", "#6c5ce7"],
      description: "Warm flat design oranges and purples",
      category: "Flat Design"
    },
    {
      name: "Flat UI Yellows",
      colors: ["#fff9c4", "#fdcb6e", "#f39c12", "#e67e22", "#d35400", "#a04000"],
      description: "Sunny flat design yellows and oranges",
      category: "Flat Design"
    }
  ],
  "Web Safe": [
    {
      name: "Web Safe Grays",
      colors: ["#ffffff", "#cccccc", "#999999", "#666666", "#333333", "#000000"],
      description: "Web-safe grayscale colors",
      category: "Web Safe"
    },
    {
      name: "Web Safe Blues",
      colors: ["#e6f3ff", "#cce7ff", "#99d6ff", "#66c2ff", "#3399ff", "#0066cc"],
      description: "Web-safe blue palette",
      category: "Web Safe"
    },
    {
      name: "Web Safe Greens",
      colors: ["#e6ffe6", "#ccffcc", "#99ff99", "#66ff66", "#33cc33", "#009900"],
      description: "Web-safe green colors",
      category: "Web Safe"
    },
    {
      name: "Web Safe Reds",
      colors: ["#ffe6e6", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#cc0000"],
      description: "Web-safe red palette",
      category: "Web Safe"
    },
    {
      name: "Primary Web Colors",
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff", "#000000"],
      description: "Basic web-safe primary colors",
      category: "Web Safe"
    }
  ],
  "Accessibility": [
    {
      name: "High Contrast",
      colors: ["#000000", "#ffffff", "#ffff00", "#0000ff", "#ff0000", "#00ff00"],
      description: "High contrast colors for accessibility",
      category: "Accessibility"
    },
    {
      name: "Color Blind Safe",
      colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f"],
      description: "Colors distinguishable by color blind users",
      category: "Accessibility"
    },
    {
      name: "WCAG AA Compliant",
      colors: ["#ffffff", "#f8f9fa", "#e9ecef", "#6c757d", "#495057", "#343a40", "#212529", "#000000"],
      description: "Colors meeting WCAG AA contrast standards",
      category: "Accessibility"
    }
  ],
  "Trending 2024": [
    {
      name: "Digital Lavender",
      colors: ["#f8f6ff", "#e8e2ff", "#d4c5ff", "#c0a8ff", "#ac8bff", "#986eff", "#8451ff", "#7034ff"],
      description: "Trending digital lavender tones",
      category: "Trending 2024"
    },
    {
      name: "Cyber Green",
      colors: ["#f0fff4", "#e6ffed", "#b3ffd1", "#80ffb5", "#4dff99", "#1aff7d", "#00e666", "#00cc55"],
      description: "Futuristic cyber green palette",
      category: "Trending 2024"
    },
    {
      name: "Sunset Orange",
      colors: ["#fff8f0", "#fff0e6", "#ffdbcc", "#ffc6b3", "#ffb199", "#ff9c80", "#ff8766", "#ff724d"],
      description: "Warm sunset orange gradients",
      category: "Trending 2024"
    },
    {
      name: "Ocean Blue",
      colors: ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1"],
      description: "Deep ocean blue tones",
      category: "Trending 2024"
    }
  ]
};

export function ColorSchemes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const categories = Object.keys(COLOR_SCHEMES);

  const copyToClipboard = async (hex: string, schemeName: string) => {
    const success = await copyText(hex);
    if (success) {
      setCopiedColor(hex);
      toast.success(`Copied from ${schemeName}: ${hex}`);
      setTimeout(() => setCopiedColor(null), 2000);
    } else {
      toast.error("Failed to copy");
    }
  };

  const copyScheme = async (colors: string[], schemeName: string) => {
    const colorString = colors.join(", ");
    const success = await copyText(colorString);
    if (success) {
      toast.success(`Copied entire ${schemeName} palette`);
    } else {
      toast.error("Failed to copy scheme");
    }
  };

  const downloadScheme = (scheme: ColorScheme) => {
    const schemeData = {
      name: scheme.name,
      colors: scheme.colors,
      description: scheme.description,
      category: scheme.category,
      downloadedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(schemeData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scheme.name.toLowerCase().replace(/\s+/g, '-')}-scheme.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${scheme.name} scheme`);
  };

  const filterSchemes = () => {
    let allSchemes: ColorScheme[] = [];
    
    if (selectedCategory) {
      allSchemes = COLOR_SCHEMES[selectedCategory] || [];
    } else {
      Object.values(COLOR_SCHEMES).forEach(categorySchemes => {
        allSchemes = [...allSchemes, ...categorySchemes];
      });
    }

    if (!searchTerm) return allSchemes;

    return allSchemes.filter(scheme =>
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const displaySchemes = filterSchemes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Schemes Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Discover the perfect color scheme for your website or app. With Tailwind CSS, Flat Design, Material Design, and Web-Safe color schemes, you'll definitely find the ideal color palette for your project.
          </p>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search color schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="w-full mb-2"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="w-full text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Schemes Grid */}
      <div className="grid gap-6">
        {displaySchemes.map((scheme, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {scheme.name}
                    <Badge variant="secondary">{scheme.category}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {scheme.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyScheme(scheme.colors, scheme.name)}
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    Copy All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadScheme(scheme)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Color Preview Strip */}
              <div className="flex mb-4 rounded-lg overflow-hidden border">
                {scheme.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="flex-1 h-16 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color, scheme.name)}
                    title={`Click to copy: ${color}`}
                  />
                ))}
              </div>

              {/* Individual Colors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {scheme.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div
                      className="h-12 w-full cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color, scheme.name)}
                    />
                    <div className="p-2">
                      <div className="flex items-center justify-between">
                        <code className="text-xs font-mono">{color}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(color, scheme.name)}
                        >
                          {copiedColor === color ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displaySchemes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3>No color schemes found</h3>
            <p className="text-muted-foreground">
              Try searching with a different term or select another category
            </p>
          </CardContent>
        </Card>
      )}

      {/* Usage Guide */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="mb-4">How to Use Color Schemes</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  1
                </div>
                <p>Browse categories or search for specific color schemes</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <p>Click on individual colors to copy their hex codes</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <p>Use "Copy All" to get the entire color palette</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  4
                </div>
                <p>Download schemes as JSON files for your design tools</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}