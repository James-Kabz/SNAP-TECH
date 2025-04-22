"use client"
import React, { ReactNode } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

interface ColumnDef<T> {
    header: string
    accessor: keyof T | string | ((row: T) => ReactNode)
    cell?: (row: T) => ReactNode
    className?: string
}

interface DataTableProps<T> {
    columns: ColumnDef<T> []
    data: T[]
    emptyMessage?: string
    onRowClick?: (row: T) => void
    className?: string
}

export function DataTable<T>({
    columns,
    data,
    emptyMessage = "No Data Found",
    onRowClick,
    className = "",
}: DataTableProps<T>) {

    const getNestedValue = (obj: T, path: string): ReactNode => {
        const value = path.split('.').reduce<unknown>((acc, key) => {
            return typeof acc === 'object' && acc !== null && key in acc ? acc[key as keyof typeof acc] : undefined;
        }, obj);
        return typeof value === 'string' || typeof value === 'number'
            ? value
            : value === null || value === undefined
                ? null
                : React.isValidElement(value)
                    ? value
                    : JSON.stringify(value);
    };
    
    return (
        <div className={`rounded-md border ${className}`}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column,index) => (
                            <TableHead key={index} className={column.className}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-8">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, rowIndex) => (
                            <TableRow
                             key={rowIndex}
                             onClick={() => onRowClick?.(row)}
                             className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                            >
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} className={column.className}>
                                        {column.cell
                                          ? column.cell(row)
                                          : typeof column.accessor === "function"
                                          ? column.accessor(row)
                                          : typeof column.accessor === "string" && column.accessor.includes('.')
                                          ? getNestedValue(row, column.accessor)
                                          : (row[column.accessor as keyof T] as string)}
                                    </TableCell>
                                ))}

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}