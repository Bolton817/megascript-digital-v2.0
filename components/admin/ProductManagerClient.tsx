"use client";

import React, { useState, useTransition } from "react";
import { Product, PublishStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  toggleProductStatusAction,
  updateProductOutboundUrlAction,
} from "@/server/actions/cms";
import {
  Check,
  AlertCircle,
  RefreshCw,
  Eye,
  ExternalLink,
  Edit2,
  X,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

interface ProductManagerClientProps {
  initialProducts: Product[];
}

export function ProductManagerClient({ initialProducts }: ProductManagerClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal / Editor State for Outbound URL
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [urlInput, setUrlInput] = useState<string>("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const openUrlEditor = (product: Product) => {
    setEditingProduct(product);
    setUrlInput(product.outboundUrl || "");
    setUrlError(null);
  };

  const closeUrlEditor = () => {
    setEditingProduct(null);
    setUrlInput("");
    setUrlError(null);
  };

  const handleSaveUrl = () => {
    if (!editingProduct) return;

    const trimmed = urlInput.trim();
    if (trimmed.length > 0 && !trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setUrlError("Destination URL must begin with http:// or https://");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateProductOutboundUrlAction(
          editingProduct.id,
          trimmed.length > 0 ? trimmed : null
        );

        if (result.success && result.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? (result.product as Product) : p))
          );
          setFeedback({
            type: "success",
            message: `Outbound URL updated for ${editingProduct.name}. Cache revalidated.`,
          });
          closeUrlEditor();
        }
      } catch (err: any) {
        setUrlError(err?.message || "Failed to update destination URL");
      }
    });
  };

  const handleClearUrl = () => {
    if (!editingProduct) return;

    startTransition(async () => {
      try {
        const result = await updateProductOutboundUrlAction(editingProduct.id, null);
        if (result.success && result.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? (result.product as Product) : p))
          );
          setFeedback({
            type: "success",
            message: `Outbound URL cleared for ${editingProduct.name}. Reverted to safe demo fallback.`,
          });
          closeUrlEditor();
        }
      } catch (err: any) {
        setUrlError(err?.message || "Failed to clear URL");
      }
    });
  };

  const handleToggleStatus = (productId: string, currentStatus: PublishStatus) => {
    const nextStatus =
      currentStatus === PublishStatus.PUBLISHED
        ? PublishStatus.DRAFT
        : PublishStatus.PUBLISHED;

    startTransition(async () => {
      try {
        const result = await toggleProductStatusAction(productId, nextStatus);
        if (result.success && result.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === productId ? (result.product as Product) : p))
          );
          setFeedback({
            type: "success",
            message: `Product status updated to ${nextStatus}. Cache revalidated.`,
          });
        }
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: err?.message || "Failed to update product status",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <Check className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Outbound URL Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  Configure Outbound Destination
                </h3>
                <p className="text-xs text-muted-foreground">
                  Product: <strong className="text-foreground">{editingProduct.name}</strong> ({editingProduct.slug})
                </p>
              </div>
              <button
                type="button"
                onClick={closeUrlEditor}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-surface-muted border border-border text-xs text-muted-foreground leading-relaxed space-y-1">
                <strong className="text-foreground block">Zero Guessed URL Rule (TDD Sheet 175):</strong>
                <p>
                  When no valid URL is configured, the public CTA safely falls back to demo inquiry and displays a &quot;Platform Launching Soon&quot; badge. Configure a live URL only when the dedicated platform is operational.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="outboundUrlInput"
                  className="block text-xs font-bold text-foreground"
                >
                  Dedicated Platform URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <input
                    id="outboundUrlInput"
                    type="url"
                    placeholder="https://app.example.com"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setUrlError(null);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {urlError && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {urlError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending || !editingProduct.outboundUrl}
                onClick={handleClearUrl}
                className="text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10"
              >
                Clear URL (Use Fallback)
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeUrlEditor}
                  disabled={isPending}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={isPending}
                  onClick={handleSaveUrl}
                  className="text-xs gap-1"
                >
                  {isPending && <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />}
                  Save Destination
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Catalog Table */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted border-b border-border text-muted-foreground">
              <tr>
                <th className="py-3 px-4 font-semibold w-12 text-center">#</th>
                <th className="py-3 px-4 font-semibold">Product Name</th>
                <th className="py-3 px-4 font-semibold">Slug &amp; Route</th>
                <th className="py-3 px-4 font-semibold">Outbound Platform URL</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => {
                const hasUrl =
                  typeof product.outboundUrl === "string" &&
                  product.outboundUrl.trim().length > 0;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-surface-muted transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-muted-foreground">
                      {product.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-xs mt-0.5">
                        {product.tagline}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      /products/{product.slug}
                    </td>
                    <td className="py-3.5 px-4">
                      {hasUrl ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={product.outboundUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline truncate max-w-[180px]"
                          >
                            <span>{product.outboundUrl}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                          <button
                            type="button"
                            onClick={() => openUrlEditor(product)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground"
                            title="Edit URL"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            size="sm"
                            className="text-[10px] border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10"
                          >
                            <Sparkles className="h-2.5 w-2.5 mr-1" />
                            <span>Safe Fallback (Launching Soon)</span>
                          </Badge>
                          <button
                            type="button"
                            onClick={() => openUrlEditor(product)}
                            className="text-[11px] text-primary hover:underline font-semibold"
                          >
                            Configure
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          product.status === PublishStatus.PUBLISHED
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/preview?path=/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary px-2 py-1 rounded-lg border border-border bg-background transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Preview</span>
                        </a>

                        <Button
                          variant={product.status === PublishStatus.PUBLISHED ? "outline" : "primary"}
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          className="text-[11px] h-7 px-2.5"
                        >
                          {isPending && <RefreshCw className="h-3 w-3 animate-spin mr-1" />}
                          {product.status === PublishStatus.PUBLISHED ? "Unpublish" : "Publish"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
