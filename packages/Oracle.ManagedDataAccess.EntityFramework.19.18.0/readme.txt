Oracle.ManagedDataAccess.EntityFramework Nuget Package Version 19.18.0 README
=============================================================================

Release Notes: Oracle Data Provider for .NET, Managed Driver for Entity Framework

January 2023

This document provides information that supplements the Oracle Data Provider for .NET (ODP.NET) for Entity 
Framework documentation. You have downloaded Oracle Data Provider for .NET for Entity Framework from Oracle, 
the license agreement to which is available at 
https://www.oracle.com/downloads/licenses/distribution-license.html

TABLE OF CONTENTS
*New Features
*Installation and Configuration Steps
*Installation Changes
*Documentation Corrections and Additions
*Entity Framework Tips, Limitations, and Known Issues


Note: Please consult the ODP.NET, Managed Driver NuGet README at packages\Oracle.ManagedDataAccess.<version> 
for more information about the component.

Note: The 32-bit "Oracle Developer Tools for Visual Studio" download from http://otn.oracle.com/dotnet is 
required for Entity Framework design-time features. This NuGet download does not enable design-time tools; it 
only provides run-time support. This version of ODP.NET for Entity Framework supports Oracle Database version 
11.2 and higher.


Bug Fixes since Oracle.ManagedDataAccess.EntityFramework NuGet Package 19.14.0
==============================================================================
None


Installation and Configuration Steps
====================================
The downloads are NuGet packages that can be installed with the NuGet Package Manager. These instructions apply 
to install ODP.NET, Managed Driver for Entity Framework.

1. Un-GAC any existing ODP.NET for Entity Framework 19c versions you have installed. For example, if you 
plan to use only the ODP.NET, Managed Driver for Entity Framework, only un-GAC existing managed ODP.NET for
Entity Framework 19c versions then.

2. In Visual Studio, open NuGet Package Manager from an existing Visual Studio project. 

3. Install the NuGet package from an OTN-downloaded local package source or from nuget.org.


   From Local Package Source
   -------------------------
   A. Click on the Settings button in the lower left of the dialog box.

   B. Click the "+" button to add a package source. In the Source field, enter in the directory location where the 
   NuGet package(s) were downloaded to. Click the Update button, then the Ok button.

   C. On the left side, under the Online root node, select the package source you just created. The ODP.NET for 
   Entity Framework NuGet package will appear.


   From Nuget.org
   --------------
   A. In the Search box in the upper right, search for the package with id, 
   "Oracle.ManagedDataAccess.EntityFramework". Verify that the package uses this unique ID to ensure it is the 
   offical Oracle Data Provider for .NET, Managed Driver for Entity Framework downloads.

   B. Select the package you wish to install.


4. Click on the Install button to select the desired NuGet package(s) to include with the project. Accept the 
license agreement and Visual Studio will continue the setup. ODP.NET, Managed Driver will be installed 
automatically as a dependency for ODP.NET, Managed Driver for Entity Framework.

5. Open the app/web.config file to configure the ODP.NET connection string and local naming parameters 
(i.e. tnsnames.ora). Below is an example of configuring the local naming parameters:

  <oracle.manageddataaccess.client>
    <version number="*">
      <dataSources>
        <!-- Customize these connection alias settings to connect to Oracle DB -->
        <dataSource alias="SampleDataSource" descriptor="(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=ORCL))) " />
      </dataSources>
    </version>
  </oracle.manageddataaccess.client>

6. Modify the app/web.config file's connection string to create a DbContext your Entity Framework application 
will use. Below is an example of a configured DbContext.

  <connectionStrings>
    <add name="OracleDbContext" providerName="Oracle.ManagedDataAccess.Client"
      connectionString="User Id=hr;Password=hr;Data Source=MyDataSource"/>
  </connectionStrings>

After following these instructions, ODP.NET, Managed Driver for Entity Framework is now configured and ready 
to use.

NOTE: ODP.NET, Managed Driver may require its own configuration. Please consult the component's README
at packages\Oracle.ManagedDataAccess.<version>.


Installation Changes
====================
The following app/web.config entries are added by including the "Official Oracle ODP.NET, Managed Entity Framework Driver" 
NuGet package to your application.

1) Entity Framework

The following entry is added to enable Entity Framework to use Oracle.ManagedDataAccess.dll for executing Entity 
Framework related-operations, such as Entity Framework Code First and Entity Framework Code First Migrations against 
the Oracle Database.

<configuration>
  <entityFramework>
    <providers>
      <provider invariantName="Oracle.ManagedDataAccess.Client" type="Oracle.ManagedDataAccess.EntityFramework.EFOracleProviderServices, Oracle.ManagedDataAccess.EntityFramework, Version=6.122.19.1, Culture=neutral, PublicKeyToken=89b483f429c47342" />
    </providers>
  </entityFramework>
</configuration>

2) Connection String

The following entry is added to enable the classes that are derived from DbContext to be associated with a connection 
string instead to associating the derived class with a connection string programmatically by passing it via its 
constructor. The name of "OracleDbContext" should be changed to the class name of your class that derives from DbContext. 
In addition, the connectionString attribute should be modified properly to set the "User Id", "Password", and 
"Data Source" appropriately with valid values.

<configuration>
  <connectionStrings>
    <add name="OracleDbContext" providerName="Oracle.ManagedDataAccess.Client" connectionString="User Id=oracle_user;Password=oracle_user_password;Data Source=oracle" />
  </connectionStrings>
</configuration>


Documentation Corrections and Additions
=======================================
None


Entity Framework Tips, Limitations, and Known Issues
====================================================
This section contains Entity Framework related information that pertains to ODP.NET. 

1. Executing LINQ or ESQL query against tables with one or more column names that are close to or equal to the maximum 
length of identifiers (30 bytes) may encounter "ORA-00972: identifier is too long" error, due to the usage of alias 
identifier(s) in the generated SQL that exceed the limit.



 Copyright (c) 2021, 2022, Oracle and/or its affiliates. 
