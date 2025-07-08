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
			$this->link->close();
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
			$this->link->close();
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

			$this->link->close();
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
			$this->link->close();
			return ['id' => $id];
		} catch (Exception $e) {
			handleException($e);
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
			$this->link->close();
			return ['updated' => $updated];
		} catch (Exception $e) {
			handleException($e);
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
			$this->link->close();
			return ['deleted' => $deleted];
		} catch (Exception $e) {
			handleException($e);
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
			$this->link->close();
			return $data;
		} catch (Exception $e) {
			handleException($e);
		}
	}

	public function escapeString($string)
	{
		$this->connect();
		$escaped = $this->link->real_escape_string($string);
		$this->link->close();
		return $escaped;
	}

	public function getLastId()
	{
		$this->connect();
		$id = $this->link->insert_id;
		$this->link->close();
		return $id;
	}
}
