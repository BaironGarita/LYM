<?php

use Psr\Log\LoggerInterface;

class MySqlConnect
{
	private $result;
	private $sql;
	private $username;
	private $password;
	private $host;
	private $dbname;
	private $link;

	private $inTransaction = false;

	private $log;

	public function __construct()
	{
		// Parametros de conexión
		$this->username = Config::get('DB_USERNAME');
		$this->password = Config::get('DB_PASSWORD');
		$this->host = Config::get('DB_HOST');
		$this->dbname = Config::get('DB_DBNAME');
		//Instancia Log
		$this->log = new Logger();
	}
	/**
	 * Establecer la conexión
	 */
	public function connect()
	{
		try {
			// Reuse connection if already connected and alive
			if ($this->link instanceof mysqli) {
				// thread_id is set for active connections; avoid calling ping() on closed objects
				if (!empty($this->link->thread_id) && @$this->link->ping()) {
					return;
				}
				// connection appears closed/invalid, release reference
				$this->link = null;
			}
			$this->link = new mysqli($this->host, $this->username, $this->password, $this->dbname);
		} catch (Exception $e) {
			handleException($e);
		}
	}
	/**
	 * Ejecutar una setencia SQL tipo SELECT
	 * @param $sql - string sentencia SQL
	 * @param $resultType - tipo de formato del resultado (obj,asoc,num)
	 * @return $resultType
	 */
	//
	public function executeSQL($sql, $resultType = "obj")
	{
		$lista = [];
		try {
			$this->connect();
			if ($result = $this->link->query($sql)) {
				switch ($resultType) {
					case "obj":
						while ($row = $result->fetch_object()) {
							$lista[] = $row;
						}
						break;
					case "asoc":
						while ($row = $result->fetch_assoc()) {
							$lista[] = $row;
						}
						break;
					case "num":
						while ($row = $result->fetch_row()) {
							$lista[] = $row;
						}
						break;
					default:
						while ($row = $result->fetch_object()) {
							$lista[] = $row;
						}
						break;
				}
			} else {
				handleException($this->link->error);
				throw new \Exception('Error: Falló la ejecución de la sentencia' . $this->link->errno . ' ' . $this->link->error);
			}
			if (!$this->inTransaction) {
				$this->link->close();
				$this->link = null;
			}
			return $lista;
		} catch (Exception $e) {
			handleException($e);
		}
	}
	/**
	 * Ejecutar una setencia SQL tipo INSERT,UPDATE
	 * @param $sql - string sentencia SQL
	 * @return $num_result - numero de resultados de la ejecución
	 */
	//
	public function executeSQL_DML($sql)
	{
		$num_results = 0;
		$lista = NULL;
		try {
			$this->connect();
			if ($result = $this->link->query($sql)) {
				$num_results = mysqli_affected_rows($this->link);
			}
			if (!$this->inTransaction) {
				$this->link->close();
				$this->link = null;
			}
			return $num_results;
		} catch (Exception $e) {
			/* $this->log->error("File: ".$e->getFile()." - line: ".$e->getLine()." - Code: ".$e->getCode()." - Message: ".$e->getMessage());
			throw new \Exception('Error: ' . $e->getMessage()); */
			handleException($e);
		}
	}
	/**
	 * Ejecutar una setencia SQL tipo INSERT,UPDATE
	 * @param $sql - string sentencia SQL
	 * @return $num_result- último id insertado
	 */
	//
	public function executeSQL_DML_last($sql)
	{
		$num_results = 0;
		$lista = NULL;
		try {
			$this->connect();
			if ($result = $this->link->query($sql)) {
				$num_results = $this->link->insert_id;
			}

			if (!$this->inTransaction) {
				$this->link->close();
				$this->link = null;
			}
			return $num_results;
		} catch (Exception $e) {
			handleException($e);
		}
	}
	/**
	 * Ejecutar una sentencia SQL tipo INSERT
	 * @param string $sql - Sentencia SQL
	 * @param array $params - Parámetros para la sentencia preparada
	 * @return array - Último ID insertado
	 */
	public function runInsert($sql, $params = [])
	{
		try {
			$this->connect();
			$stmt = $this->link->prepare($sql);
			if ($params) {
				$types = str_repeat('s', count($params));
				$stmt->bind_param($types, ...$params);
			}
			$stmt->execute();
			$id = $this->link->insert_id;
			$stmt->close();
			if (!$this->inTransaction) {
				$this->link->close();
				$this->link = null;
			}
			return ['id' => $id];
		} catch (Exception $e) {
			handleException($e);
			return ['id' => 0];
		}
	}


	/**
	 * Ejecutar una sentencia SQL tipo UPDATE
	 * @param string $sql - Sentencia SQL
	 * @param array $params - Parámetros para la sentencia preparada
	 * @return array - Número de filas actualizadas
	 */
	public function runUpdate($sql, $params = [])
	{
		try {
			$this->connect();
			$stmt = $this->link->prepare($sql);
			if ($params) {
				$types = str_repeat('s', count($params));
				$stmt->bind_param($types, ...$params);
			}
			$stmt->execute();
			$updated = $stmt->affected_rows;
			$stmt->close();
			if (!$this->inTransaction) {
				$this->link->close();
				$this->link = null;
			}
			return ['updated' => $updated];
		} catch (Exception $e) {
			handleException($e);
			return ['updated' => 0];
		}
	}

	/**
	 * Ejecutar una sentencia SQL tipo DELETE
	 * @param string $sql - Sentencia SQL
	 * @param array $params - Parámetros para la sentencia preparada
	 * @return array - Número de filas eliminadas
	 */
	public function runDelete($sql, $params = [])
	{
		try {
			$this->connect();
			$stmt = $this->link->prepare($sql);
			if ($params) {
				$types = str_repeat('s', count($params));
				$stmt->bind_param($types, ...$params);
			}
			$stmt->execute();
			$deleted = $stmt->affected_rows;
			$stmt->close();
			if (!$this->inTransaction) {
				$this->link->close();
				$this->link = null;
			}
			return ['deleted' => $deleted];
		} catch (Exception $e) {
			handleException($e);
			return ['deleted' => 0];
		}
	}

	/**
	 * Ejecutar una sentencia SQL tipo SELECT
	 * @param string $sql - Sentencia SQL
	 * @param array $params - Parámetros para la sentencia preparada
	 * @return array - Resultados obtenidos
	 */
	public function runQuery($sql, $params = [])
	{
		try {
			$this->connect();
			$stmt = $this->link->prepare($sql);
			if ($params) {
				$types = str_repeat('s', count($params));
				$stmt->bind_param($types, ...$params);
			}
			$stmt->execute();
			$result = $stmt->get_result();
			$data = [];
			while ($row = $result->fetch_assoc()) {
				$data[] = $row;
			}
			$stmt->close();
			if (!$this->inTransaction) {
				$this->link->close();
			}
			return $data;
		} catch (Exception $e) {
			handleException($e);
			return [];
		}
	}

	// Transaction helpers for mysqli wrapper
	public function beginTransaction()
	{
		$this->connect();
		$this->link->begin_transaction();
		$this->inTransaction = true;
	}

	public function commit()
	{
		if ($this->link instanceof mysqli && $this->inTransaction) {
			$this->link->commit();
			$this->inTransaction = false;
			$this->link->close();
			$this->link = null;
		}
	}

	public function rollBack()
	{
		if ($this->link instanceof mysqli && $this->inTransaction) {
			$this->link->rollback();
			$this->inTransaction = false;
			$this->link->close();
			$this->link = null;
		}
	}

	public function escapeString($string)
	{
		$this->connect();
		$escaped = $this->link->real_escape_string($string);
		$this->link->close();
		$this->link = null;
		return $escaped;
	}

	public function getLastId()
	{
		$this->connect();
		$id = $this->link->insert_id;
		$this->link->close();
		$this->link = null;
		return $id;
	}

	public function getPdo()
	{
		try {
			// Log minimal de depuración: no imprimir password completo en producción
			error_log('[MySqlConnect::getPdo] host=' . $this->host . ' user=' . ($this->username ? 'set' : 'empty') . ' db=' . $this->dbname);
			$dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
			$pdo = new PDO($dsn, $this->username, $this->password, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_EMULATE_PREPARES => false,
			]);
			return $pdo;
		} catch (Exception $e) {
			handleException($e);
			return null;
		}
	}
}
