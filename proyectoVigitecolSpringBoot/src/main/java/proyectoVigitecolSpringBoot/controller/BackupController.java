package proyectoVigitecolSpringBoot.controller;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.io.ByteArrayOutputStream;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/backup")
public class BackupController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/excel")
    public ResponseEntity<byte[]> generarBackupCompletoExcel() {
        try (Connection connection = dataSource.getConnection()) {

            // 🔹 Obtener todas las tablas del esquema actual
            DatabaseMetaData metaData = connection.getMetaData();
            ResultSet tables = metaData.getTables(connection.getCatalog(), null, "%", new String[]{"TABLE"});

            Workbook workbook = new XSSFWorkbook();
            CellStyle headerStyle = crearEstiloEncabezado(workbook);

            List<String> tablasProcesadas = new ArrayList<>();

            while (tables.next()) {
                String tableName = tables.getString("TABLE_NAME");

                // Evitar tablas del sistema si existieran
                if (tableName.startsWith("sys_") || tableName.startsWith("hibernate_")) continue;

                tablasProcesadas.add(tableName);
                Sheet sheet = workbook.createSheet(tableName);

                Statement stmt = connection.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT * FROM " + tableName);
                ResultSetMetaData rsMeta = rs.getMetaData();
                int columnCount = rsMeta.getColumnCount();

                // Crear encabezados
                Row headerRow = sheet.createRow(0);
                for (int i = 1; i <= columnCount; i++) {
                    Cell cell = headerRow.createCell(i - 1);
                    cell.setCellValue(rsMeta.getColumnName(i));
                    cell.setCellStyle(headerStyle);
                }

                // Llenar filas
                int rowNum = 1;
                while (rs.next()) {
                    Row row = sheet.createRow(rowNum++);
                    for (int i = 1; i <= columnCount; i++) {
                        Object value = rs.getObject(i);
                        row.createCell(i - 1).setCellValue(value != null ? value.toString() : "");
                    }
                }

                // Ajustar ancho de columnas
                for (int i = 0; i < columnCount; i++) {
                    sheet.autoSizeColumn(i);
                }

                rs.close();
                stmt.close();
            }

            if (tablasProcesadas.isEmpty()) {
                Sheet emptySheet = workbook.createSheet("Sin datos");
                emptySheet.createRow(0).createCell(0).setCellValue("No se encontraron tablas en la base de datos");
            }

            // 🔸 Convertir a bytes para descarga
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();

            byte[] excelBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=backup_completo_vigitecol.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private CellStyle crearEstiloEncabezado(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
}
