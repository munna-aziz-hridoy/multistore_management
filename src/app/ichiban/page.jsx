"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import useIchibanIphones from "@/hooks/useIchibanIphones";
// react import
import React from "react";

function IchibanPage() {
  const [activeTab, setActiveTab] = useState("iphone");
  const router = useRouter();
  const path = usePathname();

  const {
    iphones,
    stats,
    loading,
    error,
    lastUpdated,
    fetchIphones,
    refetch,
    getChangedProducts,
    isCacheExpired,
  } = useIchibanIphones();

  useEffect(() => {
    if (activeTab === "iphone") {
      fetchIphones();
    }
  }, [activeTab, fetchIphones]);

  function handleSetActive(tab) {
    setActiveTab(tab);
    router.push(`${path}?list=${tab}`);
  }

  const handleRefresh = async () => {
    await refetch();
  };

  const formatPrice = (price) => {
    return price.replace(/[^\d,]/g, "").replace(",", ",");
  };

  const changedProducts = getChangedProducts();

  return (
    <div>
      <div className="flex gap-2 items-center">
        <h2 className="text-xl font-bold text-black/[0.84] capitalize flex items-center gap-2">
          Ichiban
        </h2>
      </div>

      {/* <ProductTable /> */}

      <div className="flex gap-2 items-center mt-3">
        <button
          onClick={() => handleSetActive("iphone")}
          className={`font-semibold px-4 py-1  border-b-[0px] border-2  rounded-t ${
            activeTab === "iphone"
              ? "border-primary/20 text-primary bg-white"
              : "border-transparent text-black/60 bg-transparent"
          } 
          `}
        >
          iPhone
        </button>
        <button
          onClick={() => handleSetActive("android")}
          className={`font-semibold px-4 py-1  border-b-[0px] border-2  rounded-t ${
            activeTab === "android"
              ? "border-primary/20 text-primary bg-white"
              : "border-transparent text-black/60 bg-transparent"
          } 
          `}
        >
          Android
        </button>
      </div>
      {activeTab === "iphone" ? (
        <div className="bg-white rounded-b-lg border border-primary/20 p-6">
          {/* Header with stats and refresh */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <h3 className="text-lg font-semibold">iPhone Prices</h3>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Total: {stats.totalProducts}</span>
                {stats.changedProducts > 0 && (
                  <span className="text-orange-600 font-medium">
                    Changed: {stats.changedProducts}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Price changes alert */}
          {changedProducts.length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-orange-800">
                  {changedProducts.length} price change
                  {changedProducts.length > 1 ? "s" : ""} detected!
                </span>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-800">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Error: {error}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && iphones.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="text-gray-500">
                          Loading iPhone data...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : iphones.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No iPhone data available
                    </td>
                  </tr>
                ) : (
                  iphones.map((phone) => (
                    <tr
                      key={phone.id}
                      className={`hover:bg-gray-50 ${
                        phone.changed ? "bg-orange-50" : ""
                      }`}
                    >
                      <td className="px-6 py-0.5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-md object-cover"
                              src={phone.image}
                              alt={phone.name}
                              onError={(e) => {
                                e.target.src = "/placeholder-phone.png";
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-0.5">
                        <div className="text-sm font-medium text-gray-900">
                          {phone.name}
                        </div>
                      </td>
                      <td className="px-6 py-0.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            ¥{formatPrice(phone.price)}
                          </span>
                          {phone.changed && phone.prevPrice && (
                            <span className="text-xs text-gray-500">
                              was ¥{formatPrice(phone.prevPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-0.5 whitespace-nowrap">
                        {phone.changed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Price Changed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Stable
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-0.5 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {phone.id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cache status */}
          {isCacheExpired() && !loading && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              Cache expired. Click refresh to get latest data.
            </div>
          )}
        </div>
      ) : activeTab === "android" ? (
        <div className="bg-white rounded-b-lg border border-primary/20 p-6">
          <h2>Android - Coming Soon</h2>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default IchibanPage;
