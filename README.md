
Punto1
--Se crea la funcion para contar los pacientes, donde nos llega por parametro la fecha inicial y una fecha final
CREATE OR REPLACE FUNCTION contar_pacientes(fecha_inicio IN DATE DEFAULT NULL,fecha_fin IN DATE DEFAULT NULL) RETURN NUMBER IS    
 cantidad NUMBER := 0;
--bloque de la funcion
BEGIN
	--condicion en la cual la fecha de inicial y final no son nulas, si se cumple se contaran los pacientes.
    IF fecha_inicio IS NOT NULL AND fecha_fin IS NOT NULL THEN
        SELECT COUNT(*)
        INTO cantidad
        FROM PACIENTES
	
        WHERE FECHACREACION BETWEEN fecha_inicio AND fecha_fin
        AND ESTADO = 'ACTIVO';
        --mostramos la cantidad de pacientes creados entre las fechas que se cumplieron con la condicion
        DBMS_OUTPUT.PUT_LINE('Cantidad de pacientes creados entre ' || fecha_inicio || ' y ' || fecha_fin || ': ' || cantidad);
        
        --obtenemos los nombres completos de los pacientes por los intervalos de fecha inicial y fecha final
        FOR paciente IN (SELECT NOMBRE1 || ' ' || COALESCE(NOMBRE2, '') || ' ' || APELLIDO1 || ' ' || COALESCE(APELLIDO2, '') AS NOMBRE_COMPLETO
                         FROM PACIENTES
                         WHERE FECHACREACION BETWEEN fecha_inicio AND fecha_fin AND ESTADO = 'ACTIVO') LOOP

         --Mostramos cada paciente con su repectivo nombre completo.
		   DBMS_OUTPUT.PUT_LINE('Paciente: ' || paciente.NOMBRE_COMPLETO);
        END LOOP;

       --hacemos una segunda condicion que de lo contrario es porque la fecha inicial no esta nula, posterior a esto se mostrara los pacientes desde la fecha inicial  
    ELSE IF fecha_inicio IS NOT NULL THEN
        SELECT COUNT(*)
        INTO cantidad
        FROM PACIENTES
        WHERE FECHACREACION >= fecha_inicio
        AND ESTADO = 'ACTIVO';

        --Mostramos los pacientes de creados desde una fecha especifica que es la fecha inicial
        DBMS_OUTPUT.PUT_LINE('Cantidad de pacientes creados desde  ' || fecha_inicio || ': ' || cantidad);

       
        -- Obtenemos los nombres completos de cada paciente por medio del ciclo for que fueron creados desde la fehca_inicio.
        FOR paciente IN (SELECT NOMBRE1 || ' ' || COALESCE(NOMBRE2, '') || ' ' || APELLIDO1 || ' ' || COALESCE(APELLIDO2, '') AS NOMBRE_COMPLETO
                         FROM PACIENTES
                         WHERE FECHACREACION >= fecha_inicio
                         AND ESTADO = 'ACTIVO') LOOP
	--Mostramos cada pacientes con su nombre completo el cual cumplio la condicion
            DBMS_OUTPUT.PUT_LINE('Paciente: ' || paciente.NOMBRE_COMPLETO);
        END LOOP;
    
    --De lo contrario se mostrarar los pacientes que tiene un estado 'activo'  
    ELSE
        SELECT COUNT(*)
        INTO cantidad
        FROM PACIENTES
        WHERE ESTADO = 'ACTIVO';
        
        DBMS_OUTPUT.PUT_LINE('Cantidad total de pacientes activos: ' || cantidad);
        
        -- Obtener los nombres completos de todos los pacientes activos
        FOR paciente IN (SELECT NOMBRE1 || ' ' || COALESCE(NOMBRE2, '') || ' ' || APELLIDO1 || ' ' || COALESCE(APELLIDO2, '') AS NOMBRE_COMPLETO
                         FROM PACIENTES
                         WHERE ESTADO = 'ACTIVO') LOOP
            --Mostramos cada paciente con su nombre completo que cumplio esta ultima condicion.
            DBMS_OUTPUT.PUT_LINE('Paciente: ' || paciente.NOMBRE_COMPLETO);
        END LOOP;
        --fin de las condicion
    END IF;
    
    RETURN cantidad;
END contar_pacientes;
/