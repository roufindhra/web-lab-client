import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Checkbox } from "../components/ui/Checkbox";
import { Select } from "../components/ui/Select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";

import { Dialog, DialogTrigger, DialogContent } from "../components/ui/Dialog";

export function DesignSystemTest() {
  const [checkboxState, setCheckboxState] = useState(false);
  const [selectedAngkatan, setSelectedAngkatan] = useState("");
  const [inputValue, setInputValue] = useState("");

  const dummyAngkatanOptions = [
    { value: "250", label: "Angkatan 2025" },
    { value: "240", label: "Angkatan 2024" },
    { value: "190", label: "Angkatan 2019" },
  ];

  const dummyData = [
    {
      id: 1,
      nim: "117250027",
      nama: "Zahra Nafsin Zakia",
      alat: "Total Station GNSS",
      status: "borrowed",
    },
    {
      id: 2,
      nim: "117250028",
      nama: "Arum Tri Astuti",
      alat: "Waterpass Automatic Level",
      status: "available",
    },
    {
      id: 3,
      nim: "117240015",
      nama: "Budi Santoso",
      alat: "Drone LiDAR Matrix",
      status: "maintenance",
    },
  ];

  return (
    <div className="min-h-screen bg-surface p-8 text-surface-text">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-primary">
            Cek Hasil Radix UI
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Testing dan verifikasi token warna, font, dan komponen Radix UI.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold border-b pb-1">
            1. Button Variants and Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">
              Primary Small
            </Button>
            <Button variant="primary" size="md">
              Primary Medium
            </Button>
            <Button variant="primary" size="lg">
              Primary Large
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold border-b pb-1">
            2. Status Badges
          </h2>
          <div className="flex items-center gap-3">
            <Badge variant="available">Tersedia</Badge>
            <Badge variant="borrowed">Dipinjam</Badge>
            <Badge variant="maintenance">Maintenance</Badge>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-1">
            3. Form Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Standard Input
              </label>
              <Input
                placeholder="Cari nama alat..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Error State Input
              </label>
              <Input
                placeholder="Input bermasalah..."
                error="NIM wajib diisi dengan 9 digit angka"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Radix Select Dropdown
              </label>
              <Select
                options={dummyAngkatanOptions}
                placeholder="Pilih Angkatan"
                value={selectedAngkatan}
                onValueChange={(val) => setSelectedAngkatan(val)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Deskripsu tambahan di bawah dropdown
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Radix Checkbox
              </label>
              <div className="mt-2">
                <Checkbox
                  label="Pilih semua alat"
                  checked={checkboxState}
                  onCheckedChange={(val) => setCheckboxState(Boolean(val))}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold border-b pb-1">
            4. Modal, Dialog, and Surface Container
          </h2>
          <div className="rounded-lg border bg-surface-container p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Container Accent Surface</p>
              <p className="text-xs text-gray-600">
                Klik tombol untuk menguji komponen Dialog Radix UI
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary">Uji Dialog / Modal</Button>
              </DialogTrigger>
              <DialogContent title="Pengujian Modal Dialog">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Ini bentukan konten di dalam modal yang pakai Radix UI
                    Portal dan styled menggunakan token warna.
                  </p>

                  <Input placeholder="Contoh input di dalam modal..." />

                  <Select
                    options={dummyAngkatanOptions}
                    placeholder="Contoh filter di dalam modal"
                  />

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      Batal
                    </Button>
                    <Button variant="primary" size="sm">
                      Simpan
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold border-b pb-1">
            5. Card dan Table
          </h2>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Daftar Peminjaman Alat Laboratorium</CardTitle>
              <CardDescription>
                Status peminjaman alat oleh mahasiswa
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama Mahasiswa</TableHead>

                    <TableHead>Alat Praktikum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">
                        {item.nim}
                      </TableCell>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>{item.alat}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status as
                              | "available"
                              | "borrowed"
                              | "maintenance"
                          }
                        >
                          {item.status === "borrowed"
                            ? "Dipinjam"
                            : item.status === "available"
                              ? "Tersedia"
                              : "Maintenance"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
