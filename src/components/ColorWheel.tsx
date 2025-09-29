import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Copy, Check, Download, Shuffle, Target, Palette } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { copyToClipboard as copyText } from "../utils/clipboard";

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
}

interface PaletteColor extends ColorInfo {
  position: number;
}

export function ColorWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
  const [generatedPalette, setGeneratedPalette] = useState<PaletteColor[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [baseHue, setBaseHue] = useState(0);

  useEffect(() => {
    drawColorWheel();
  }, []);

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;

      for (let r = 0; r < radius; r += 1) {
        const saturation = r / radius;
        const lightness = 0.5;
        const hsl = `hsl(${angle}, ${saturation * 100}%, ${lightness * 100}%)`;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, startAngle, endAngle);
        ctx.strokeStyle = hsl;
        ctx.stroke();
      }
    }

    // Draw center circle (white to black gradient)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#000000');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxRadius = Math.min(centerX, centerY) - 20;

    if (distance > maxRadius) return;

    let hue, saturation, lightness;

    if (distance <= 50) {
      // Center circle - grayscale
      const grayValue = Math.round((1 - distance / 50) * 255);
      const hex = rgbToHex(grayValue, grayValue, grayValue);
      const rgb = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
      const hsl = `hsl(0, 0%, ${Math.round(grayValue / 255 * 100)}%)`;
      
      setSelectedColor({
        hex,
        rgb,
        hsl,
        name: getColorName(hex)
      });
    } else {
      // Color wheel
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      hue = ((angle + 360) % 360);
      saturation = (distance - 50) / (maxRadius - 50);
      lightness = 0.5;

      const color = hslToRgb(hue / 360, saturation, lightness);
      const hex = rgbToHex(color.r, color.g, color.b);
      const rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;
      const hsl = `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;

      setSelectedColor({
        hex,
        rgb,
        hsl,
        name: getColorName(hex)
      });

      setBaseHue(hue);
    }
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const getColorName = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const exactColors: { [key: string]: string } = {
      "#000000": "Black",
      "#FFFFFF": "White",
      "#FF0000": "Red",
      "#00FF00": "Green",
      "#0000FF": "Blue",
      "#FFFF00": "Yellow",
      "#FF00FF": "Magenta",
      "#00FFFF": "Cyan",
      "#808080": "Gray"
    };

    if (exactColors[hex.toUpperCase()]) {
      return exactColors[hex.toUpperCase()];
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    if (diff < 15) {
      if (max < 50) return "Very Dark Gray";
      if (max < 100) return "Dark Gray";
      if (max < 150) return "Medium Gray";
      if (max < 200) return "Light Gray";
      return "Very Light Gray";
    }

    let colorName = "";
    if (r > g && r > b) {
      colorName = g > b ? "Orange" : "Red";
    } else if (g > r && g > b) {
      colorName = r > b ? "Yellow" : "Green";
    } else if (b > r && b > g) {
      colorName = r > g ? "Purple" : "Blue";
    }

    const lightness = (max + min) / 2;
    if (lightness < 80) colorName = "Dark " + colorName;
    else if (lightness > 180) colorName = "Light " + colorName;

    return colorName || "Custom Color";
  };

  const generateHarmoniousPalette = (harmonyType: string) => {
    if (!selectedColor) {
      toast.error("Please select a color from the wheel first");
      return;
    }

    const baseH = baseHue;
    let hues: number[] = [];

    switch (harmonyType) {
      case "complementary":
        hues = [baseH, (baseH + 180) % 360];
        break;
      case "triadic":
        hues = [baseH, (baseH + 120) % 360, (baseH + 240) % 360];
        break;
      case "tetradic":
        hues = [baseH, (baseH + 90) % 360, (baseH + 180) % 360, (baseH + 270) % 360];
        break;
      case "analogous":
        hues = [
          (baseH - 30 + 360) % 360,
          baseH,
          (baseH + 30) % 360,
          (baseH + 60) % 360
        ];
        break;
      case "splitComplementary":
        hues = [baseH, (baseH + 150) % 360, (baseH + 210) % 360];
        break;
      default:
        return;
    }

    const palette: PaletteColor[] = hues.map((hue, index) => {
      const color = hslToRgb(hue / 360, 0.7, 0.5);
      const hex = rgbToHex(color.r, color.g, color.b);
      return {
        hex,
        rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
        hsl: `hsl(${Math.round(hue)}, 70%, 50%)`,
        name: getColorName(hex),
        position: index
      };
    });

    setGeneratedPalette(palette);
    toast.success(`Generated ${harmonyType} color palette!`);
  };

  const generateRandomPalette = () => {
    const randomHue = Math.floor(Math.random() * 360);
    setBaseHue(randomHue);
    
    const palette: PaletteColor[] = [];
    for (let i = 0; i < 5; i++) {
      const hue = (randomHue + i * 72) % 360;
      const saturation = 0.6 + Math.random() * 0.4;
      const lightness = 0.4 + Math.random() * 0.4;
      
      const color = hslToRgb(hue / 360, saturation, lightness);
      const hex = rgbToHex(color.r, color.g, color.b);
      
      palette.push({
        hex,
        rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
        hsl: `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`,
        name: getColorName(hex),
        position: i
      });
    }

    setGeneratedPalette(palette);
    toast.success("Generated random color palette!");
  };

  const copyToClipboard = async (text: string, label: string) => {
    const success = await copyText(text);
    if (success) {
      setCopiedColor(text);
      toast.success(`Copied ${label}: ${text}`);
      setTimeout(() => setCopiedColor(null), 2000);
    } else {
      toast.error("Failed to copy");
    }
  };

  const downloadPalette = () => {
    if (generatedPalette.length === 0) {
      toast.error("No palette generated yet");
      return;
    }

    const paletteData = {
      colors: generatedPalette.map(color => ({
        name: color.name,
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl
      })),
      baseHue,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "color-wheel-palette.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Palette downloaded successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Interactive Color Wheel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create perfect color palettes using our interactive color wheel. Click anywhere on the wheel to select a color, then generate harmonious color schemes based on color theory.
          </p>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Color Wheel */}
        <Card>
          <CardHeader>
            <CardTitle>Color Wheel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="cursor-crosshair border rounded-lg"
              onClick={handleCanvasClick}
            />
            <p className="text-sm text-muted-foreground text-center">
              Click anywhere on the color wheel to select a color
            </p>
          </CardContent>
        </Card>

        {/* Selected Color */}
        {selectedColor && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Color</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="w-full h-24 rounded-lg border-2 border-border"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Name</span>
                  <span className="font-mono">{selectedColor.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HEX</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono">{selectedColor.hex}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedColor.hex, "HEX")}
                    >
                      {copiedColor === selectedColor.hex ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">RGB</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono">{selectedColor.rgb}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedColor.rgb, "RGB")}
                    >
                      {copiedColor === selectedColor.rgb ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HSL</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono">{selectedColor.hsl}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedColor.hsl, "HSL")}
                    >
                      {copiedColor === selectedColor.hsl ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Harmony Generators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Harmony Generators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button
              onClick={() => generateHarmoniousPalette("complementary")}
              variant="outline"
              size="sm"
            >
              Complementary
            </Button>
            <Button
              onClick={() => generateHarmoniousPalette("triadic")}
              variant="outline"
              size="sm"
            >
              Triadic
            </Button>
            <Button
              onClick={() => generateHarmoniousPalette("tetradic")}
              variant="outline"
              size="sm"
            >
              Tetradic
            </Button>
            <Button
              onClick={() => generateHarmoniousPalette("analogous")}
              variant="outline"
              size="sm"
            >
              Analogous
            </Button>
            <Button
              onClick={() => generateHarmoniousPalette("splitComplementary")}
              variant="outline"
              size="sm"
            >
              Split-Comp
            </Button>
            <Button
              onClick={generateRandomPalette}
              variant="outline"
              size="sm"
            >
              <Shuffle className="h-3 w-3 mr-2" />
              Random
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Palette */}
      {generatedPalette.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Color Palette</CardTitle>
              <Button size="sm" onClick={downloadPalette}>
                <Download className="h-3 w-3 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Color Strip */}
            <div className="flex mb-4 rounded-lg overflow-hidden border">
              {generatedPalette.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-20 cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex, color.name)}
                  title={`Click to copy: ${color.hex}`}
                />
              ))}
            </div>

            {/* Individual Colors */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {generatedPalette.map((color, index) => (
                <div
                  key={index}
                  className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="h-16 w-full cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex, color.name)}
                  />
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">HEX</span>
                      <code className="text-xs font-mono">{color.hex}</code>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-7"
                      onClick={() => copyToClipboard(color.hex, color.name)}
                    >
                      {copiedColor === color.hex ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="mb-4">How to Use Color Wheel</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  1
                </div>
                <p>Click anywhere on the color wheel to select a base color</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <p>Choose a harmony type to generate a color palette</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <p>Click on any color in the palette to copy its hex code</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  4
                </div>
                <p>Download the palette as JSON for use in design tools</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Theory Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Color Theory Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">Complementary Colors</h4>
                <p className="text-sm text-muted-foreground">
                  Colors opposite each other on the color wheel. They create high contrast and vibrant looks.
                </p>
              </div>
              <div>
                <h4 className="mb-2">Triadic Colors</h4>
                <p className="text-sm text-muted-foreground">
                  Three colors evenly spaced around the color wheel. Creates vibrant yet balanced palettes.
                </p>
              </div>
              <div>
                <h4 className="mb-2">Analogous Colors</h4>
                <p className="text-sm text-muted-foreground">
                  Colors next to each other on the wheel. Creates serene and comfortable designs.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">Tetradic Colors</h4>
                <p className="text-sm text-muted-foreground">
                  Four colors arranged into two complementary pairs. Offers plenty of possibilities.
                </p>
              </div>
              <div>
                <h4 className="mb-2">Split-Complementary</h4>
                <p className="text-sm text-muted-foreground">
                  Base color plus two colors adjacent to its complement. Less contrast than complementary.
                </p>
              </div>
              <div>
                <h4 className="mb-2">Random Palette</h4>
                <p className="text-sm text-muted-foreground">
                  Generates a random harmonious palette for creative inspiration.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}