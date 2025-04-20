-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-04-2025 a las 23:45:28
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
  `edad` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `foto_animal` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `animales`
--

INSERT INTO `animales` (`id_animal`, `id_especie`, `nombre_animal`, `edad`, `descripcion`, `foto_animal`) VALUES
(2, 2, 'Firulais', 10, 'Muy tierna y tranquila, color negro y blanco.', '1744587833000.jpg'),
(4, 1, 'Kayla', 12, 'Muy tierna y tranquila, color negro y blanco.', '1744559156414.jfif'),
(5, 1, 'Amapola', 7, 'Muy tierna y tranquila, color negro y blanco.', '1744585873352.jpg'),
(6, 2, 'Kayla', 12, 'Muy gris y mala', '1744585885879.jfif'),
(7, 2, 'Nucita', 7, 'Muy tierna y tranquila, color negro y blanco.', '1744586912719.jfif');

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
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_apellido` varchar(40) NOT NULL,
  `email` varchar(30) NOT NULL,
  `localidad` varchar(10) DEFAULT NULL,
  `genero` varchar(4) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `foto_usuario` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_apellido`, `email`, `localidad`, `genero`, `password`, `foto_usuario`) VALUES
(1, 'Prueba', 'prueba@gmail.com', 'CABA', 'F', '$2a$08$IdMfefp8', '1731199351887.jpg'),
(2, 'Katty', 'katty@gmail.com', 'CABA', 'F', '$2a$08$qH8NCbgv', '1731199734959.jpg'),
(3, 'Juan Pérez', 'amy@gmail.com', 'Zona Norte', 'F', 'Prueba123', '1731352177923.jpg'),
(5, 'Leonel Girett', 'usuario1@gmail.com', 'CABA', 'M', '$2a$08$7eyDVGkoQiCO.', '1731351583346.jpg'),
(6, 'asd', 'adas@prueba.com', 'zona sur', 'm', '$2a$08$q7TcbGG/J139l', '1743970208243.jpg'),
(7, 'Leonel1', 'nuevo@prueba.com', 'zona sur', 'M', '$2a$08$mVCiy3LoSyJhV6YLn.WykuzKBgQi/w/S0k4mYquEtpkbN3yboxfqK', '1743970730874.jpeg');

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
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

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
  MODIFY `id_animal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
-- Filtros para la tabla `voluntarios`
--
ALTER TABLE `voluntarios`
  ADD CONSTRAINT `fk_voluntarios_asignaciones` FOREIGN KEY (`id_asignacion`) REFERENCES `asignaciones` (`id_asignacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
