-- Se habilita la creación de usuarios
ALTER SESSION SET "_ORACLE_SCRIPT" = TRUE;


--
-- Creación del tablespace `tbs_blog_cms`
--
CREATE TABLESPACE tbs_blog_cms
	DATAFILE 'tbs_blog_cms_data.dbf'
	SIZE 100M
	ONLINE;


-- CREACION TABLESPACE EN RDS
CREATE BIGFILE TABLESPACE tbs_blog_cms DATAFILE SIZE 5G;


--
-- Consulta de los tablespaces para corroborar que el tablespace se haya creado
--
SELECT
	tablespace_name
	, status
FROM dba_tablespaces;


--
-- Creación del usuario `blog_cms`
--
CREATE USER blog_cms
	IDENTIFIED BY mNhxoyxdlRle
	DEFAULT TABLESPACE tbs_blog_cms
	QUOTA UNLIMITED ON tbs_blog_cms;


--
-- Consulta de los usuarios para corroborar que el usuario se haya creado
--
SELECT
	username
	, default_tablespace
FROM dba_users;


--
-- Creacion del role manager
--
CREATE ROLE manager;


--
-- Concender privilegios al role `manager`
--
GRANT
	CREATE SESSION
	, CREATE TABLE
	, ALTER ANY TABLE
	, DROP ANY TABLE
	, SELECT ANY TABLE
	, INSERT ANY TABLE
	, UPDATE ANY TABLE
	, DELETE ANY TABLE
	, CREATE SEQUENCE
	, ALTER ANY SEQUENCE
	, DROP ANY SEQUENCE
	, SELECT ANY SEQUENCE
	, CREATE ANY INDEX
	, DROP ANY INDEX
	, ALTER ANY INDEX
	, CREATE ANY TRIGGER
	, ALTER ANY TRIGGER
	, DROP ANY TRIGGER
	, CREATE ANY PROCEDURE
	, ALTER ANY PROCEDURE
	, DROP ANY PROCEDURE
	, EXECUTE ANY PROCEDURE
	, CREATE VIEW
	, DROP ANY VIEW
TO manager;


--
-- Asignar el role `manager` a el usuario `blog_cms`
--
GRANT manager TO blog_cms;


--
-- Consultar los privilefios concedidos al role `manager`
--
SELECT
	grantee
	, privilege
FROM dba_sys_privs
WHERE grantee = 'MANAGER';


