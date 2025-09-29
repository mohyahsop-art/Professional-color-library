import { useState } from "react";
import { ColorLibrary } from "./components/ColorLibrary";
import { ColorWheel } from "./components/ColorWheel";
import { ColorSchemes } from "./components/ColorSchemes";
import { Toaster } from "./components/ui/sonner";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Palette, Target, Grid, Paintbrush, Copy, Search } from "lucide-react";

type Page = "library" | "wheel" | "schemes";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("library");

  const pages = [
    {
      id: "wheel" as Page,
      name: "Color Wheel",
      icon: Target,
      description: "Create perfect color palettes using our interactive color wheel"
    },
    {
      id: "schemes" as Page,
      name: "Color Schemes",
      icon: Grid,
      description: "Discover curated color schemes for web design"
    },
    {
      id: "library" as Page,
      name: "Color Library",
      icon: Palette,
      description: "Browse our comprehensive color collection"
    }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "wheel":
        return <ColorWheel />;
      case "schemes":
        return <ColorSchemes />;
      case "library":
      default:
        return (
          <>
            {/* Introduction */}
            <div className="mb-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2>Discover and Use Perfect Colors for Your Project</h2>
                <p className="text-muted-foreground mt-2">
                  A comprehensive library featuring hundreds of carefully organized colors, with quick search and copy functionality in HEX and RGB formats
                </p>
              </div>
            </div>

            {/* Quick Features */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Palette className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm mb-1">Hundreds of Colors</h4>
                  <p className="text-xs text-muted-foreground">
                    Colors organized in different categories
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Search className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm mb-1">Smart Search</h4>
                  <p className="text-xs text-muted-foreground">
                    Search by name or color code
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Copy className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm mb-1">Quick Copy</h4>
                  <p className="text-xs text-muted-foreground">
                    Copy in HEX or RGB format
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Paintbrush className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm mb-1">Organized Categories</h4>
                  <p className="text-xs text-muted-foreground">
                    Grouped by color families
                  </p>
                </CardContent>
              </Card>
            </div>

            <ColorLibrary />

            {/* How to Use */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2>How to Use</h2>
                <p className="text-muted-foreground">
                  Easy ways to make the most of the color library
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">1</span>
                    </div>
                    <h3>Choose Category</h3>
                    <p className="text-muted-foreground">
                      Select the appropriate color category for your project or search directly
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">2</span>
                    </div>
                    <h3>Click on Color</h3>
                    <p className="text-muted-foreground">
                      Click on the desired color to automatically copy the HEX code
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">3</span>
                    </div>
                    <h3>Use in Your Project</h3>
                    <p className="text-muted-foreground">
                      Paste the color in your CSS editor or favorite design tool
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Color Format Information */}
            <div className="mt-16 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2>Available Color Formats</h2>
                    <p className="text-muted-foreground">
                      Learn about different formats for representing colors
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="mb-3">HEX (Hexadecimal)</h3>
                      <p className="text-muted-foreground mb-2">
                        The most common color system in web development
                      </p>
                      <code className="bg-muted p-2 rounded text-sm">#FF5733</code>
                    </div>
                    
                    <div>
                      <h3 className="mb-3">RGB (Red-Green-Blue)</h3>
                      <p className="text-muted-foreground mb-2">
                        System that defines the amount of each primary color from 0 to 255
                      </p>
                      <code className="bg-muted p-2 rounded text-sm">rgb(255, 87, 51)</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-xl">
                <Palette className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl">Complete Color Tools</h1>
                <p className="text-muted-foreground">
                  Professional color tools for designers and developers
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {pages.map((page) => {
              const IconComponent = page.icon;
              return (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? "default" : "ghost"}
                  onClick={() => setCurrentPage(page.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <IconComponent className="h-4 w-4" />
                  {page.name}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Palette className="h-5 w-5 text-primary" />
              <span className="text-lg">Complete Color Tools</span>
            </div>
            <p className="text-muted-foreground">
              Professional color tools for designers and developers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}