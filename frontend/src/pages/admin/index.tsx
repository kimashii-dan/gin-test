import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getAllUsers, getAllListings, deleteUser, deleteListing } from "./api";
import type { AdminUser, AdminListing } from "./api";
import { Button } from "../../shared/ui/button";
import {
  TrashIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ErrorScreen from "../../shared/ui/error-screen";
import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";

export default function AdminPanel() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"users" | "listings">("users");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
    retry: false,
  });

  const {
    data: listings,
    isLoading: listingsLoading,
    isError: listingsError,
  } = useQuery({
    queryKey: ["admin", "listings"],
    queryFn: getAllListings,
    retry: false,
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin-login");
  };

  if (usersError || listingsError) {
    return <ErrorScreen text={t("admin.panel.error")} />;
  }

  return (
    <section className="page-layout">
      <div className={styles.header}>
        <h1 className="page-title">{t("admin.panel.title")}</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex gap-2 items-center"
        >
          <ArrowLeftStartOnRectangleIcon className="size-5" />
          {t("admin.panel.logout")}
        </Button>
      </div>

      <div className={styles.tabs}>
        <button
          className={activeTab === "users" ? styles.tab_active : styles.tab}
          onClick={() => setActiveTab("users")}
        >
          {t("admin.panel.tabs.users")} ({users?.length || 0})
        </button>
        <button
          className={activeTab === "listings" ? styles.tab_active : styles.tab}
          onClick={() => setActiveTab("listings")}
        >
          {t("admin.panel.tabs.listings")} ({listings?.length || 0})
        </button>
      </div>

      {activeTab === "users" && (
        <div className={styles.content}>
          {usersLoading ? (
            <p>{t("admin.panel.loading.users")}</p>
          ) : (
            <div className={styles.table_container}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t("admin.panel.users.table.id")}</th>
                    <th>{t("admin.panel.users.table.email")}</th>
                    <th>{t("admin.panel.users.table.name")}</th>
                    <th>{t("admin.panel.users.table.university")}</th>
                    <th>{t("admin.panel.users.table.listings")}</th>
                    <th>{t("admin.panel.users.table.rating")}</th>
                    <th>{t("admin.panel.users.table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: AdminUser) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.name || "-"}</td>
                      <td>{user.university || "-"}</td>
                      <td>{user.listings_count}</td>
                      <td>
                        {user.rating_count > 0
                          ? `${user.average_rating.toFixed(1)} (${user.rating_count})`
                          : "-"}
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          className="flex gap-2 items-center"
                          onClick={() => {
                            if (
                              window.confirm(
                                t("admin.panel.users.delete.confirm", {
                                  email: user.email,
                                })
                              )
                            ) {
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                          disabled={deleteUserMutation.isPending}
                        >
                          <TrashIcon className="size-4" />
                          {t("admin.panel.users.delete.button")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "listings" && (
        <div className={styles.content}>
          {listingsLoading ? (
            <p>{t("admin.panel.loading.listings")}</p>
          ) : (
            <div className={styles.table_container}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t("admin.panel.listings.table.id")}</th>
                    <th>{t("admin.panel.listings.table.title")}</th>
                    <th>{t("admin.panel.listings.table.price")}</th>
                    <th>{t("admin.panel.listings.table.category")}</th>
                    <th>{t("admin.panel.listings.table.status")}</th>
                    <th>{t("admin.panel.listings.table.owner")}</th>
                    <th>{t("admin.panel.listings.table.images")}</th>
                    <th>{t("admin.panel.listings.table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {listings?.map((listing: AdminListing) => (
                    <tr key={listing.id}>
                      <td>{listing.id}</td>
                      <td className={styles.title_cell}>{listing.title}</td>
                      <td>${listing.price}</td>
                      <td>{listing.category}</td>
                      <td>
                        <span
                          className="{
                            listing.is_closed
                              ? styles.badge_closed
                              : styles.badge_available
                          }"
                        >
                          {listing.is_closed
                            ? t("admin.panel.listings.status.closed")
                            : t("admin.panel.listings.status.available")}
                        </span>
                      </td>
                      <td>
                        {listing.user_name || listing.user_email}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          ID: {listing.user_id}
                        </span>
                      </td>
                      <td>{listing.images_count}</td>
                      <td>
                        <Button
                          variant="danger"
                          className="flex gap-2 items-center"
                          onClick={() => {
                            if (
                              window.confirm(
                                t("admin.panel.listings.delete.confirm", {
                                  title: listing.title,
                                })
                              )
                            ) {
                              deleteListingMutation.mutate(listing.id);
                            }
                          }}
                          disabled={deleteListingMutation.isPending}
                        >
                          <TrashIcon className="size-4" />
                          {t("admin.panel.listings.delete.button")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
