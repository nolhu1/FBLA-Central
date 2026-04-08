import { useEffect, useState } from "react";
import { ActivityIndicator, Share, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

import { AppScreen } from "@/components/common/AppScreen";
import { EmptyResourcesState } from "@/components/resources/EmptyResourcesState";
import { PdfViewerHeader } from "@/components/resources/PdfViewerHeader";
import { useGetResourcesQuery } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

const localPdfAssets = {
  "demo-local-travel-packet": require("../../../assets/pdfs/fbla-local-travel-packet.pdf"),
  "demo-local-officer-transition": require("../../../assets/pdfs/fbla-officer-transition-playbook.pdf"),
  "demo-local-conference-etiquette": require("../../../assets/pdfs/fbla-conference-etiquette-guide.pdf"),
  "demo-local-season-timeline": require("../../../assets/pdfs/fbla-season-timeline-onepager.pdf"),
  "demo-local-data-science-ai-guidelines": require("../../../assets/pdfs/Data-Science-and-AI.pdf")
} as const;

export const PdfViewerScreen = ({ route }: any) => {
  const { resourceId } = route.params;
  const { data: resources = [] } = useGetResourcesQuery();
  const [loading, setLoading] = useState(true);
  const [resolvedViewerUrl, setResolvedViewerUrl] = useState<string | null>(null);
  const [resolvedHtml, setResolvedHtml] = useState<string | null>(null);

  const resource = resources.find((item) => item.id === resourceId);
  const externalUrl = resource?.url ?? resource?.sourceUrl ?? null;
  const buildPdfJsViewerUrl = (fileUrl: string) =>
    `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
  const localPdfAsset =
    resource?.storagePath && resource.storagePath in localPdfAssets
      ? localPdfAssets[resource.storagePath as keyof typeof localPdfAssets]
      : null;
  const generatedDocumentHtml = resource
    ? `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              margin: 0;
              padding: 24px 20px 40px;
              background: #f6f1e3;
              color: #10233d;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            .chip {
              display: inline-block;
              padding: 6px 10px;
              border-radius: 999px;
              background: #e2c15a;
              color: #10233d;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.02em;
              margin-bottom: 16px;
            }
            h1 {
              font-size: 28px;
              line-height: 1.15;
              margin: 0 0 12px;
            }
            p {
              font-size: 15px;
              line-height: 1.6;
              margin: 0 0 14px;
            }
            .meta {
              color: #3d5677;
              font-size: 13px;
              margin-bottom: 20px;
            }
            .section {
              margin-top: 22px;
              padding-top: 18px;
              border-top: 1px solid rgba(16, 35, 61, 0.12);
            }
            .section h2 {
              font-size: 15px;
              margin: 0 0 10px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            ul {
              margin: 0;
              padding-left: 18px;
            }
            li {
              margin-bottom: 8px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="chip">${resource.category}</div>
          <h1>${resource.title}</h1>
          <p class="meta">${resource.sourceName} • ${resource.estimatedReadMinutes} min</p>
          <p>${resource.summary}</p>
          <div class="section">
            <h2>Focus areas</h2>
            <ul>
              ${resource.tags.map((tag) => `<li>${tag}</li>`).join("")}
            </ul>
          </div>
          <div class="section">
            <h2>Use this for</h2>
            <p>Reviewing the core guidance before meetings, prep sessions, and event planning.</p>
          </div>
        </body>
      </html>
    `
    : null;

  useEffect(() => {
    let mounted = true;

    const resolveViewerUrl = async () => {
      setLoading(true);
      if (mounted) {
        setResolvedViewerUrl(null);
        setResolvedHtml(null);
      }

      if (!resource) {
        if (mounted) {
          setResolvedViewerUrl(null);
          setResolvedHtml(null);
        }
        return;
      }

      if (localPdfAsset) {
        const asset = Asset.fromModule(localPdfAsset);
        if (!asset.localUri) {
          await asset.downloadAsync();
        }

        if (mounted) {
          const localFileUrl = asset.localUri ?? asset.uri;
          if (localFileUrl) {
            const base64Pdf = await FileSystem.readAsStringAsync(localFileUrl, {
              encoding: FileSystem.EncodingType.Base64
            });
            setResolvedHtml(`
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
                  <style>
                    html, body {
                      margin: 0;
                      padding: 0;
                      height: 100%;
                      background: #0b1522;
                      overflow: auto;
                    }
                    #app {
                      min-height: 100%;
                      display: flex;
                      flex-direction: column;
                      align-items: flex-start;
                      justify-content: flex-start;
                      padding: 12px 0 28px;
                      box-sizing: border-box;
                      background: #0b1522;
                    }
                    #status {
                      color: #f4f0e3;
                      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                      font-size: 14px;
                      padding-top: 28px;
                    }
                    canvas {
                      display: block;
                      width: calc(100% - 24px);
                      height: auto;
                      margin: 0 12px 18px;
                      background: #ffffff;
                      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
                      border-radius: 10px;
                    }
                  </style>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs" type="module"></script>
                </head>
                <body>
                  <div id="app">
                    <div id="status">Loading PDF...</div>
                  </div>
                  <script type="module">
                    import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';

                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

                    const base64 = "${base64Pdf}";
                    const binary = atob(base64);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i += 1) {
                      bytes[i] = binary.charCodeAt(i);
                    }

                    const app = document.getElementById('app');
                    const status = document.getElementById('status');

                    try {
                      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
                      if (status) {
                        status.remove();
                      }

                      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
                        const page = await pdf.getPage(pageNumber);
                        const viewport = page.getViewport({ scale: 1.35 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        app.appendChild(canvas);
                        await page.render({ canvasContext: context, viewport }).promise;
                      }
                    } catch (error) {
                      if (status) {
                        status.textContent = 'Unable to render this PDF in-app.';
                      }
                    }
                  </script>
                </body>
              </html>
            `);
          } else {
            setResolvedHtml(null);
          }
        }
        return;
      }

      if (resource.url) {
        if (mounted) {
          const isPdfUrl = resource.url.toLowerCase().includes(".pdf");
          setResolvedViewerUrl(
            isPdfUrl
              ? buildPdfJsViewerUrl(resource.url)
              : resource.url
          );
        }
        return;
      }

      if (mounted) {
        setResolvedViewerUrl(null);
        setResolvedHtml(generatedDocumentHtml);
      }
    };

    void resolveViewerUrl();

    return () => {
      mounted = false;
    };
  }, [localPdfAsset, resource]);

  if (!resource) {
    return (
      <AppScreen title="PDF Viewer" eyebrow="Resource" subtitle="Unable to load document">
        <EmptyResourcesState
          title="PDF unavailable"
          body="This resource does not currently have a PDF URL available for in-app viewing."
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen title="PDF Viewer" scroll={false}>
      <View style={styles.screen}>
        <PdfViewerHeader
          title={resource.title}
          onShare={() => void Share.share({ title: resource.title, message: externalUrl ?? resource.title })}
          onOpenExternal={() => (externalUrl ? void WebBrowser.openBrowserAsync(externalUrl) : undefined)}
        />

        <View style={styles.viewerShell}>
          {loading || (!resolvedViewerUrl && !resolvedHtml) ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={palette.gold} />
              <Text style={styles.loadingText}>
                {resolvedViewerUrl || resolvedHtml ? "Loading document..." : "Preparing document..."}
              </Text>
            </View>
          ) : null}
          {resolvedViewerUrl || resolvedHtml ? (
            <WebView
              source={
                resolvedHtml
                  ? { html: resolvedHtml }
                  : localPdfAsset || (resource.url && resource.url.toLowerCase().includes(".pdf"))
                  ? { uri: resolvedViewerUrl }
                  : generatedDocumentHtml
                    ? { html: generatedDocumentHtml }
                    : { uri: resolvedViewerUrl }
              }
              originWhitelist={["*"]}
              onLoadEnd={() => setLoading(false)}
              onError={() => setLoading(false)}
              allowFileAccess
              allowingReadAccessToURL={resolvedViewerUrl}
              setSupportMultipleWindows={false}
              style={styles.viewer}
            />
          ) : null}
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: theme.spacing.md
  },
  viewerShell: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(8,17,30,0.55)",
    zIndex: 2
  },
  loadingText: {
    ...theme.typography.label,
    color: palette.cream
  },
  viewer: {
    flex: 1
  }
});
