/**
 * Copy text to clipboard with fallback for older browsers or unsecure contexts
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern clipboard API - works in secure contexts (HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers or non-secure contexts
    return fallbackCopyToClipboard(text);
  } catch (err) {
    // If modern API fails, try fallback
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback copy method using execCommand
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Make it invisible but accessible
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.setAttribute("readonly", "");
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    
    // Select the text
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices
    
    // Copy the text
    const successful = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}