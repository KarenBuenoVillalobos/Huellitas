-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-05-2025 a las 01:34:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `huellitas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adopciones`
--

CREATE TABLE `adopciones` (
  `id_adopcion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_animal` int(11) NOT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `direccion` varchar(40) DEFAULT NULL,
  `fecha_adopcion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `adopciones`
--

INSERT INTO `adopciones` (`id_adopcion`, `id_usuario`, `id_animal`, `telefono`, `direccion`, `fecha_adopcion`) VALUES
(6, 1, 2, '1287681723', 'Av. Corrientes 1231', '2023-03-07'),
(7, 1, 2, '1287681723', 'Av. Corrientes 1231', '2023-03-07'),
(9, 1, 2, '1287681723', 'Av. Corrientes 1231', '2023-03-07'),
(12, 1, 2, '1287681723', 'Av. Corrientes 1231', '2023-03-07'),
(13, 1, 2, '1287681723', 'Av. Corrientes 1231', '2023-03-07'),
(14, 1, 2, '123456789', 'Calle Falsa 123', '2025-04-02'),
(15, 3, 2, '987654321', 'Avenida Siempre Viva 742', '2025-04-10'),
(17, 5, 2, '987654321', 'Avenida Siempre Viva 742', '2025-04-10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animales`
--

CREATE TABLE `animales` (
  `id_animal` int(11) NOT NULL,
  `id_especie` int(11) NOT NULL,
  `nombre_animal` varchar(15) NOT NULL,
  `edad` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `foto_animal` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `animales`
--

INSERT INTO `animales` (`id_animal`, `id_especie`, `nombre_animal`, `edad`, `descripcion`, `foto_animal`) VALUES
(2, 2, 'Firulais', 10, 'Muy tierna y tranquila, color negro y blanco.', '1744587833000.jpg'),
(4, 1, 'Kayla', 12, 'Muy tierna y tranquila, color negro y blanco.', '1746207750800.jpg'),
(5, 1, 'Amapola', 99, 'Muy tierna y tranquila, color negro y blanco.', '1744585873352.jpg'),
(6, 2, 'Kayla', 12, 'Muy gris y mala', '1746207757956.jfif'),
(7, 2, 'Nucita', 7, 'Muy tierna y tranquila, color negro y blanco.', '1746207765791.jfif'),
(45, 2, 'Mostrando en bd', 15, 'Esperemos que se llegue a mirar', '1746122868389.jpg'),
(47, 2, 'Bellota', 23, 'asd', '1746658634139.jpg'),
(48, 2, 'Leonel', 2, 'wqe', '1746658874951.jpg'),
(49, 2, 'Leonel', 2, 'asd', '1746658891406.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulos`
--

CREATE TABLE `articulos` (
  `id_articulo` int(11) NOT NULL,
  `nombre_articulo` varchar(25) NOT NULL,
  `detalles` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `articulos`
--

INSERT INTO `articulos` (`id_articulo`, `nombre_articulo`, `detalles`) VALUES
(1, 'Manta', '3m x 3m, color violeta'),
(2, 'Pipeta', 'Para gatos adultos'),
(3, 'Collar', 'Color verde');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `donaciones`
--

CREATE TABLE `donaciones` (
  `id_donacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_articulo` int(11) NOT NULL,
  `fecha_donacion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `donaciones`
--

INSERT INTO `donaciones` (`id_donacion`, `id_usuario`, `id_articulo`, `fecha_donacion`) VALUES
(3, 2, 3, '2020-03-07'),
(6, 1, 3, '2024-03-07'),
(7, 2, 2, '2020-03-07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especies`
--

CREATE TABLE `especies` (
  `id_especie` int(11) NOT NULL,
  `nombre_especie` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especies`
--

INSERT INTO `especies` (`id_especie`, `nombre_especie`) VALUES
(1, 'Perro'),
(2, 'Gato'),
(3, 'Conejo'),
(4, 'Ave'),
(5, 'Pez'),
(6, 'Pajaro'),
(7, 'funciona'),
(8, 'prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genero`
--

CREATE TABLE `genero` (
  `id_genero` int(11) NOT NULL,
  `descripcion` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `genero`
--

INSERT INTO `genero` (`id_genero`, `descripcion`) VALUES
(1, 'F'),
(2, 'M'),
(3, 'Otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades`
--

CREATE TABLE `localidades` (
  `id_localidad` int(11) NOT NULL,
  `descripcion` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `localidades`
--

INSERT INTO `localidades` (`id_localidad`, `descripcion`) VALUES
(1, 'Zona Sur'),
(2, 'Zona Norte'),
(3, 'Zona Oeste'),
(4, 'Zona Este'),
(5, 'CABA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `descripcion`) VALUES
(1, 'Admin'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_apellido` varchar(40) NOT NULL,
  `email` varchar(30) NOT NULL,
  `id_localidad` int(11) NOT NULL,
  `id_genero` int(11) NOT NULL,
  `password` varchar(250) NOT NULL,
  `foto_usuario` varchar(250) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_apellido`, `email`, `id_localidad`, `id_genero`, `password`, `foto_usuario`, `id_rol`) VALUES
(1, 'Probando Modificacion', 'nuevo1@prueba.com', 2, 2, '12345', '1747006336366.jpg', 1),
(2, 'Katty', 'katty@gmail.com', 1, 2, '$2a$08$qH8NCbgv', '1731199734959.jpg', 1),
(3, 'Juan Pérez', 'amy@gmail.com', 1, 1, 'Prueba123', '1731352177923.jpg', 2),
(5, 'Leonel Girett', 'usuario1@gmail.com', 5, 1, '$2a$08$7eyDVGkoQiCO.', '1731351583346.jpg', 2),
(6, 'asd', 'adas@prueba.com', 5, 1, '$2a$08$q7TcbGG/J139l', '1743970208243.jpg', 2),
(7, 'Leonel1', 'nuevo@prueba.com', 1, 1, '$2a$08$mVCiy3LoSyJhV6YLn.WykuzKBgQi/w/S0k4mYquEtpkbN3yboxfqK', '1743970730874.jpeg', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `voluntarios`
--

CREATE TABLE `voluntarios` (
  `id_voluntario` int(11) NOT NULL,
  `tarea` text NOT NULL,
  `id_asignacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `voluntarios`
--

INSERT INTO `voluntarios` (`id_voluntario`, `tarea`, `id_asignacion`) VALUES
(1, 'Por zona sur, lleva jaulas y mantas.', 1),
(2, 'Por zona sur, lleva botiquin de primeros auxilios.', 1),
(3, 'Cuida a bebes encontrados hasta que puedan encontrar dueño.', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adopciones`
--
ALTER TABLE `adopciones`
  ADD PRIMARY KEY (`id_adopcion`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_animal` (`id_animal`);

--
-- Indices de la tabla `animales`
--
ALTER TABLE `animales`
  ADD PRIMARY KEY (`id_animal`),
  ADD KEY `fk_animal_especie` (`id_especie`);

--
-- Indices de la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD PRIMARY KEY (`id_articulo`);

--
-- Indices de la tabla `donaciones`
--
ALTER TABLE `donaciones`
  ADD PRIMARY KEY (`id_donacion`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_articulo` (`id_articulo`);

--
-- Indices de la tabla `especies`
--
ALTER TABLE `especies`
  ADD PRIMARY KEY (`id_especie`);

--
-- Indices de la tabla `genero`
--
ALTER TABLE `genero`
  ADD PRIMARY KEY (`id_genero`);

--
-- Indices de la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD PRIMARY KEY (`id_localidad`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_localidad` (`id_localidad`),
  ADD KEY `fk_genero` (`id_genero`);

--
-- Indices de la tabla `voluntarios`
--
ALTER TABLE `voluntarios`
  ADD PRIMARY KEY (`id_voluntario`),
  ADD KEY `fk_voluntarios_asignaciones` (`id_asignacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adopciones`
--
ALTER TABLE `adopciones`
  MODIFY `id_adopcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `animales`
--
ALTER TABLE `animales`
  MODIFY `id_animal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `articulos`
--
ALTER TABLE `articulos`
  MODIFY `id_articulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `donaciones`
--
ALTER TABLE `donaciones`
  MODIFY `id_donacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `especies`
--
ALTER TABLE `especies`
  MODIFY `id_especie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `genero`
--
ALTER TABLE `genero`
  MODIFY `id_genero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `localidades`
--
ALTER TABLE `localidades`
  MODIFY `id_localidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `voluntarios`
--
ALTER TABLE `voluntarios`
  MODIFY `id_voluntario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adopciones`
--
ALTER TABLE `adopciones`
  ADD CONSTRAINT `adopciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `adopciones_ibfk_2` FOREIGN KEY (`id_animal`) REFERENCES `animales` (`id_animal`);

--
-- Filtros para la tabla `animales`
--
ALTER TABLE `animales`
  ADD CONSTRAINT `fk_animal_especie` FOREIGN KEY (`id_especie`) REFERENCES `especies` (`id_especie`);

--
-- Filtros para la tabla `donaciones`
--
ALTER TABLE `donaciones`
  ADD CONSTRAINT `donaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `donaciones_ibfk_2` FOREIGN KEY (`id_articulo`) REFERENCES `articulos` (`id_articulo`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_genero` FOREIGN KEY (`id_genero`) REFERENCES `genero` (`id_genero`),
  ADD CONSTRAINT `fk_localidad` FOREIGN KEY (`id_localidad`) REFERENCES `localidades` (`id_localidad`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
