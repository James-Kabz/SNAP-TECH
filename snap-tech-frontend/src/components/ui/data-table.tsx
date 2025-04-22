import { ReactNode } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

interface ColumnDef<T> {
    header: string
    accessor: keyof T | ((row: T) => ReactNode)
    cell?: (row: T) => void
    className?: string
}

interface DataTableProps<T> {
    columns: ColumnDef<T> []
    data: []
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
                                          : (row[column.accessor as keyof T] as ReactNode)}
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