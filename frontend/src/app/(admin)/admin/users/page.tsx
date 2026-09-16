"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  Ban,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Mail,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi, AdminUsersResponse } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/auth-context";
import { LoadingState } from "@/components/common/loading-state";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [userToSuspend, setUserToSuspend] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getUsers({
        q: searchQuery,
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: currentPage,
        limit: 20,
      });
      setData(res);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load users list.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleSuspend = async () => {
    if (!userToSuspend) return;
    try {
      setActionLoading(true);
      await adminApi.toggleSuspendUser(userToSuspend.id, !userToSuspend.isSuspended);
      toast.success(
        userToSuspend.isSuspended
          ? `Suspension lifted for @${userToSuspend.username}.`
          : `Account @${userToSuspend.username} has been suspended.`
      );
      setUserToSuspend(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update suspension status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setActionLoading(true);
      await adminApi.deleteUser(userToDelete.id);
      toast.success(`User @${userToDelete.username} deleted.`);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete user account.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#252D28] pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F1F4EF] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#30E87F]" />
            <span>User Management &amp; Moderation</span>
          </h1>
          <p className="mt-1 text-xs text-[#A9B1AA]">
            Inspect user accounts, manage role access, suspend malicious actors, or remove accounts.
          </p>
        </div>

        <Button
          onClick={() => fetchUsers()}
          variant="outline"
          size="sm"
          className="border-[#252D28] bg-[#0E1210] text-xs text-[#F1F4EF] hover:bg-[#141916]"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5 text-[#707A72]" />
          <span>Refresh List</span>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#252D28] bg-[#0E1210] p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#707A72]" />
          <Input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border-[#252D28] bg-[#141916] pl-9 text-xs text-[#F1F4EF] placeholder:text-[#707A72]"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              setRoleFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] border-[#252D28] bg-[#141916] text-xs text-[#F1F4EF]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="border-[#252D28] bg-[#0E1210] text-xs">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="CREATOR">Creator</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] border-[#252D28] bg-[#141916] text-xs text-[#F1F4EF]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-[#252D28] bg-[#0E1210] text-xs">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden border-[#252D28] bg-[#0E1210] shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingState message="Loading users directory..." />
          </div>
        ) : !data || data.users.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#707A72]">
            No users match the selected query or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#252D28] bg-[#141916] font-mono uppercase text-[#707A72]">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Contributions</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A211D]">
                {data.users.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  const isPrimaryAdmin =
                    u.username.toLowerCase() === "sherry" ||
                    u.email.toLowerCase() === "shaj7492@gmail.com";

                  return (
                    <tr
                      key={u.id}
                      className="transition-colors hover:bg-[#141916]/50"
                    >
                      {/* User Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-[#252D28]">
                            <AvatarImage src={u.avatar || undefined} alt={u.username} />
                            <AvatarFallback className="text-[10px]">{getInitials(u.username)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-[#F1F4EF]">
                              <span>{u.username}</span>
                              {isSelf && (
                                <Badge className="bg-[#30E87F]/20 text-[9px] text-[#30E87F]">
                                  You
                                </Badge>
                              )}
                            </div>
                            <span className="text-[11px] text-[#707A72]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold ${
                            u.role === "ADMIN"
                              ? "border border-[#30E87F]/40 bg-[#30E87F]/10 text-[#30E87F]"
                              : u.role === "CREATOR"
                              ? "border border-[#9FB8B2]/40 bg-[#9FB8B2]/10 text-[#9FB8B2]"
                              : "border border-[#252D28] bg-[#141916] text-[#A9B1AA]"
                          }`}
                        >
                          {u.role}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {u.isSuspended ? (
                          <span className="inline-flex items-center gap-1 rounded border border-[#C58F8F]/40 bg-[#C58F8F]/10 px-2 py-0.5 text-[10px] font-bold text-[#E8A0A0]">
                            <Ban className="h-3 w-3" />
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded border border-[#30E87F]/30 bg-[#30E87F]/10 px-2 py-0.5 text-[10px] font-medium text-[#30E87F]">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Metrics */}
                      <td className="px-4 py-3 text-[#A9B1AA]">
                        <div className="flex items-center gap-2">
                          <span title="Skills Created">
                            <strong className="text-[#F1F4EF]">{u._count.skills}</strong> skills
                          </span>
                          <span>•</span>
                          <span title="Reviews Posted">
                            <strong className="text-[#F1F4EF]">{u._count.reviews}</strong> reviews
                          </span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-4 py-3 font-mono text-[11px] text-[#707A72]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Suspend / Unsuspend */}
                          <Button
                            onClick={() => setUserToSuspend(u)}
                            disabled={isSelf || isPrimaryAdmin}
                            variant="outline"
                            size="sm"
                            className={`h-7 px-2 text-[11px] ${
                              u.isSuspended
                                ? "border-[#30E87F]/30 text-[#30E87F] hover:bg-[#30E87F]/10"
                                : "border-[#C58F8F]/30 text-[#C58F8F] hover:bg-[#C58F8F]/10"
                            }`}
                          >
                            {u.isSuspended ? (
                              <>
                                <UserCheck className="mr-1 h-3 w-3" />
                                Unsuspend
                              </>
                            ) : (
                              <>
                                <Ban className="mr-1 h-3 w-3" />
                                Suspend
                              </>
                            )}
                          </Button>

                          {/* Delete */}
                          <Button
                            onClick={() => setUserToDelete(u)}
                            disabled={isSelf || isPrimaryAdmin}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[11px] text-[#707A72] hover:bg-[#C58F8F]/10 hover:text-[#C58F8F]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#252D28] px-4 py-3 text-xs text-[#707A72]">
            <span>
              Showing Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} users)
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={data.pagination.page <= 1}
                variant="outline"
                size="sm"
                className="h-7 border-[#252D28] bg-[#141916] text-xs text-[#F1F4EF]"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={data.pagination.page >= data.pagination.totalPages}
                variant="outline"
                size="sm"
                className="h-7 border-[#252D28] bg-[#141916] text-xs text-[#F1F4EF]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Suspension Confirmation Modal */}
      <Dialog open={!!userToSuspend} onOpenChange={(open) => !open && setUserToSuspend(null)}>
        <DialogContent className="border-[#252D28] bg-[#0E1210] p-6 text-[#F1F4EF] sm:max-w-md">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C58F8F]/40 bg-[#C58F8F]/10 text-[#C58F8F]">
              <Ban className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              {userToSuspend?.isSuspended ? "Lift Account Suspension?" : "Suspend User Account?"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A9B1AA]">
              {userToSuspend?.isSuspended
                ? `This will restore platform access for @${userToSuspend?.username}. They will be able to log in and interact normally.`
                : `Suspending @${userToSuspend?.username} will immediately revoke all their active sessions and block them from logging in or performing actions.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setUserToSuspend(null)}
              disabled={actionLoading}
              className="border-[#252D28] bg-transparent text-xs text-[#A9B1AA]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleToggleSuspend}
              disabled={actionLoading}
              className={`text-xs font-semibold ${
                userToSuspend?.isSuspended
                  ? "bg-[#30E87F] text-[#080B0A] hover:bg-[#28C76D]"
                  : "bg-[#C58F8F] text-[#080B0A] hover:bg-[#B37878]"
              }`}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : userToSuspend?.isSuspended ? (
                "Confirm Unsuspend"
              ) : (
                "Confirm Suspension"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Destructive Modal */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="border-[#C58F8F]/40 bg-[#0E1210] p-6 text-[#F1F4EF] sm:max-w-md">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C58F8F]/60 bg-[#C58F8F]/15 text-[#C58F8F]">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-[#E8A0A0]">
              Permanently Delete User @{userToDelete?.username}?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A9B1AA]">
              This action is <strong className="text-[#E8A0A0]">irreversible</strong>. All authored skills, versions, reviews, upvotes, and saved collections belonging to this user will be permanently purged.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setUserToDelete(null)}
              disabled={actionLoading}
              className="border-[#252D28] bg-transparent text-xs text-[#A9B1AA]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="bg-[#C58F8F] text-xs font-semibold text-[#080B0A] hover:bg-[#B37878]"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
